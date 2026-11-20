#!/usr/bin/env python3
"""Foto de los usuarios de PRODUCCIÓN de El Charcu, solo lectura.

Lee `.env.prod` (SUPABASE_URL + SUPABASE_SECRET_KEY), baja las tablas del
esquema `charcu` por PostgREST (GET) y los usuarios de Auth por la API admin,
y escribe un JSON por usuario con su embudo y sus "sesiones" (días activos).

Uso:  python3 -I supabase_snapshot.py <ruta/.env.prod> <salida.json> [--desde YYYY-MM-DD]
"""

import json
import subprocess
import sys
from collections import defaultdict
from datetime import datetime, timedelta, timezone

INTERNAL_EMAILS = {
    "cperez354@gmail.com",
    # Socia de Cristian en Manos Creadoras, no es una usuaria del mercado.
    "weaf59@gmail.com",
    "tecedel@gmail.com",
    "mcamilazapataf@gmail.com",
    "ing.ceaf@gmail.com",
}
# Correos de prueba / del equipo: también fuera.
INTERNAL_SUFFIXES = ("@elcharcu.co", "@goingtube.com", "@onepay.ai")
BOGOTA = timezone(timedelta(hours=-5))
# Dos mensajes separados por más de esto cuentan como sesiones distintas.
SESSION_GAP = timedelta(minutes=30)


def load_env(path):
    env = {}
    with open(path) as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k] = v.strip().strip('"').strip("'")
    return env


def get(url, key, profile=None):
    # curl y no urllib: el Python de python.org en macOS no trae certificados.
    cmd = ["curl", "-sf", "--max-time", "60", url, "-H", f"apikey: {key}", "-H", f"Authorization: Bearer {key}"]
    if profile:
        cmd += ["-H", f"Accept-Profile: {profile}"]
    return json.loads(subprocess.run(cmd, check=True, capture_output=True).stdout)


def table(base, key, name, select="*"):
    rows, offset, page = [], 0, 1000
    while True:
        url = f"{base}/rest/v1/{name}?select={select}&limit={page}&offset={offset}"
        chunk = get(url, key, "charcu")
        rows.extend(chunk)
        if len(chunk) < page:
            return rows
        offset += page


def auth_users(base, key):
    users, p = [], 1
    while True:
        data = get(f"{base}/auth/v1/admin/users?page={p}&per_page=1000", key)
        chunk = data.get("users", [])
        users.extend(chunk)
        if len(chunk) < 1000:
            return users
        p += 1


def ts(value):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def is_internal(email):
    email = (email or "").lower()
    return email in INTERNAL_EMAILS or email.endswith(INTERNAL_SUFFIXES)


def sessions_of(times):
    times = sorted(t for t in times if t)
    if not times:
        return 0
    count = 1
    for a, b in zip(times, times[1:]):
        if b - a > SESSION_GAP:
            count += 1
    return count


def main():
    env_path, out_path = sys.argv[1], sys.argv[2]
    since = None
    if "--desde" in sys.argv:
        since = datetime.fromisoformat(sys.argv[sys.argv.index("--desde") + 1]).replace(
            tzinfo=BOGOTA
        )
    env = load_env(env_path)
    base, key = env["SUPABASE_URL"].rstrip("/"), env["SUPABASE_SECRET_KEY"]

    users = auth_users(base, key)
    profiles = {r["id"]: r for r in table(base, key, "profiles")}
    subs = defaultdict(list)
    for r in table(base, key, "subscriptions"):
        subs[r["user_id"]].append(r)
    msgs = table(base, key, "chat_messages", "user_id,visitor_id,role,created_at,content,image_path")
    recipes = table(base, key, "recipes")
    received = table(base, key, "recetas_recibidas")
    waitlist = table(base, key, "course_waitlist")
    requests = table(base, key, "course_requests")
    progress = table(base, key, "lesson_progress")
    usage = table(base, key, "usage_counters")
    webhooks = table(base, key, "webhook_eventos", "evento,tipo,estado,nota,recibido_en,cuerpo")

    by_user = defaultdict(lambda: defaultdict(list))
    for m in msgs:
        if m.get("user_id"):
            by_user[m["user_id"]]["msgs"].append(m)
    for name, rows in (
        ("recipes", recipes),
        ("received", received),
        ("waitlist", waitlist),
        ("requests", requests),
        ("progress", progress),
        ("usage", usage),
    ):
        for r in rows:
            if r.get("user_id"):
                by_user[r["user_id"]][name].append(r)

    out_users, anon_msgs = [], [m for m in msgs if not m.get("user_id")]
    for u in users:
        email = u.get("email") or ""
        uid = u["id"]
        prof = profiles.get(uid, {})
        d = by_user[uid]
        user_msgs = [m for m in d["msgs"] if m["role"] == "user"]
        times = [ts(m["created_at"]) for m in d["msgs"]] + [ts(p.get("updated_at")) for p in d["progress"]]
        if ts(u.get("last_sign_in_at")):
            times.append(ts(u["last_sign_in_at"]))
        active_days = sorted({t.astimezone(BOGOTA).date().isoformat() for t in times if t})
        sub = max(subs.get(uid, []), key=lambda s: s.get("updated_at") or "", default=None)
        paid = bool(sub and sub.get("status") == "active" and sub.get("provider") not in (None, "manual"))
        out_users.append(
            {
                "id": uid,
                "email": email,
                "name": prof.get("full_name"),
                "internal": is_internal(email),
                "created_at": u.get("created_at"),
                "confirmed": bool(u.get("email_confirmed_at")),
                "last_sign_in_at": u.get("last_sign_in_at"),
                "whatsapp": bool(prof.get("whatsapp")),
                "interests": prof.get("interests"),
                "onboarding": prof.get("onboarding_status"),
                "questions": len(user_msgs),
                "photos": sum(1 for m in user_msgs if m.get("image_path")),
                "first_questions": [m["content"][:160] for m in sorted(user_msgs, key=lambda m: m["created_at"])[:5]],
                "last_question_at": max((m["created_at"] for m in user_msgs), default=None),
                "conversations": len(d["recipes"]),
                "recipes_opened": [r["recipe_slug"] for r in d["received"]],
                "lessons_touched": len(d["progress"]),
                "lessons_completed": sum(1 for p in d["progress"] if p.get("completed_at")),
                "waitlist": len(d["waitlist"]),
                "course_requests": [r["body"][:160] for r in d["requests"]],
                "quota_used": [
                    {"period": c["period_key"], "q": c["questions_used"], "img": c["images_used"]}
                    for c in d["usage"]
                ],
                "sessions": sessions_of(times),
                "active_days": active_days,
                "returning": len(active_days) >= 2,
                "subscription": sub,
                "paid": paid,
            }
        )

    if since:
        new = [u for u in out_users if ts(u["created_at"]) >= since]
    else:
        new = out_users
    real = [u for u in out_users if not u["internal"]]

    snapshot = {
        "generated_at": datetime.now(BOGOTA).isoformat(),
        "since": since.isoformat() if since else None,
        "totals": {
            "accounts": len(real),
            "new_in_window": len([u for u in new if not u["internal"]]),
            "confirmed": sum(u["confirmed"] for u in real),
            "onboarding_completed": sum(u["onboarding"] == "listo" for u in real),
            "asked_charcu": sum(u["questions"] > 0 for u in real),
            "returning": sum(u["returning"] for u in real),
            "sessions": sum(u["sessions"] for u in real),
            "paid": sum(u["paid"] for u in real),
            "anon_questions": sum(1 for m in anon_msgs if m["role"] == "user"),
            "anon_visitors_asking": len({m["visitor_id"] for m in anon_msgs if m["role"] == "user"}),
        },
        "webhooks": [{k: w[k] for k in ("evento", "tipo", "estado", "nota", "recibido_en")} for w in webhooks],
        "users": sorted(real, key=lambda u: u["created_at"] or "", reverse=True),
    }
    with open(out_path, "w") as fh:
        json.dump(snapshot, fh, ensure_ascii=False, indent=1, default=str)
    print(json.dumps(snapshot["totals"], indent=1))


if __name__ == "__main__":
    main()
