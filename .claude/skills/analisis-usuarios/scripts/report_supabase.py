#!/usr/bin/env python3
"""Convierte la foto de `supabase_snapshot.py` en las secciones de Supabase del reporte.

Uso:  python3 -I report_supabase.py <snapshot.json> [--desde YYYY-MM-DD]

Imprime markdown: totales, embudo de cuenta (dónde se pierde la gente),
usuarios nuevos del período, quién vuelve, qué le preguntan al Charcu y la
lista de "cerca de pagar" puntuada. Las señales de Mixpanel (clic en
Suscribirme, hoja Pasar a Pro…) las añade quien corre la skill.
"""

import json
import sys
from datetime import datetime


def stage_of(u):
    """Último paso del embudo de cuenta al que llegó la persona."""
    if u["paid"]:
        return "7 pagó"
    if u["returning"]:
        return "6 volvió otro día"
    if u["questions"] > 0 or u["conversations"] > 0:
        return "5 le preguntó al Charcu"
    if u["onboarding"] == "listo":
        return "4 terminó el onboarding"
    if u["last_sign_in_at"]:
        return "3 entró (no terminó onboarding)"
    if u["confirmed"]:
        return "2 confirmó el correo"
    return "1 se registró (nunca confirmó)"


LOST_REASON = {
    "1 se registró (nunca confirmó)": "no abrió el enlace del correo (o el correo tiene un error de tecleo)",
    "2 confirmó el correo": "confirmó pero nunca abrió sesión",
    "3 entró (no terminó onboarding)": "abandonó las 3 preguntas del onboarding",
    "4 terminó el onboarding": "terminó el onboarding y no preguntó nada",
    "5 le preguntó al Charcu": "preguntó un solo día y no volvió",
}


def near_pay_score(u):
    """Señales de intención en la base. Mixpanel suma las de clic en planes."""
    s, why = 0, []
    if u["subscription"] and not u["paid"]:
        s += 5
        why.append(f"tiene suscripción {u['subscription'].get('status')}/{u['subscription'].get('rail') or u['subscription'].get('provider')}")
    if u["questions"] >= 5:
        s += 3
        why.append(f"{u['questions']} preguntas")
    elif u["questions"] >= 2:
        s += 1
        why.append(f"{u['questions']} preguntas")
    # El plan gratis (aprendiz) trae 8 preguntas al mes (charcu.plan_quotas).
    top = max((c["q"] for c in u["quota_used"]), default=0)
    if top >= 8:
        s += 3
        why.append("agotó las 8 preguntas gratis de un mes")
    elif top >= 5:
        s += 1
        why.append(f"usó {top}/8 preguntas gratis")
    if u["returning"]:
        s += 2
        why.append(f"volvió {len(u['active_days'])} días")
    if u["lessons_touched"] >= 5:
        s += 2
        why.append(f"{u['lessons_touched']} lecciones vistas")
    if u["waitlist"]:
        s += 1
        why.append("lista de espera de curso")
    if u["whatsapp"]:
        s += 1
        why.append("dejó WhatsApp")
    return s, why


def main():
    snap = json.load(open(sys.argv[1]))
    since = None
    if "--desde" in sys.argv:
        since = sys.argv[sys.argv.index("--desde") + 1]
    users, t = snap["users"], snap["totals"]
    out = []
    w = out.append

    w(f"## Totales (producción, sin cuentas internas) — {snap['generated_at'][:16]}\n")
    w(f"- Cuentas: **{t['accounts']}** · confirmadas {t['confirmed']} · onboarding listo {t['onboarding_completed']}")
    w(f"- Le preguntaron al Charcu con cuenta: **{t['asked_charcu']}** · visitantes anónimos que preguntaron: {t['anon_visitors_asking']} ({t['anon_questions']} preguntas)")
    w(f"- Sesiones con cuenta (bloques de actividad separados por 30 min): **{t['sessions']}**")
    w(f"- Vuelven (activos en ≥2 días distintos): **{t['returning']}**")
    w(f"- Pagaron: **{t['paid']}**\n")

    stages = {}
    for u in users:
        stages.setdefault(stage_of(u), []).append(u)
    w("## Dónde se pierde la gente (último paso alcanzado)\n")
    w("| Paso | Personas | Se quedaron aquí porque… |")
    w("|---|---|---|")
    for k in sorted(stages):
        w(f"| {k} | {len(stages[k])} | {LOST_REASON.get(k, '—')} |")
    lost = sum(len(v) for k, v in stages.items() if k in LOST_REASON)
    w(f"\n**Perdidos** (no pagaron y no volvieron): **{lost}** de {len(users)}.\n")

    if since:
        new = [u for u in users if (u["created_at"] or "")[:10] >= since]
        w(f"## Usuarios nuevos desde {since}: {len(new)}\n")
        for u in new:
            w(f"- {u['created_at'][:16]} · {u['email']} · {stage_of(u)} · {u['questions']} preguntas")
        w("")

    w("## Quién vuelve\n")
    for u in sorted((u for u in users if u["returning"]), key=lambda u: -len(u["active_days"])):
        w(f"- {u['email']} — {len(u['active_days'])} días ({', '.join(u['active_days'][-5:])}), {u['sessions']} sesiones, {u['questions']} preguntas")
    w("")

    w("## Qué le preguntan al Charcu (primeras preguntas)\n")
    recent = sorted((u for u in users if u["first_questions"]), key=lambda u: u["last_question_at"] or "", reverse=True)
    for u in recent[:15]:
        w(f"- **{u['email']}**: " + " / ".join(q.replace("\n", " ")[:110] for q in u["first_questions"][:3]))
    w("")

    w("## Cerca de pagar (señales de la base; cruzar con Mixpanel)\n")
    scored = sorted(((near_pay_score(u), u) for u in users if not u["paid"]), key=lambda x: -x[0][0])
    for (s, why), u in scored[:12]:
        if s < 3:
            break
        w(f"- **{s} pts** · {u['email']} ({u['name'] or 's/n'}) — {', '.join(why)}")
    w("")

    wh = [x for x in snap["webhooks"] if x["estado"] not in ("procesado",)]
    if wh:
        w("## ⚠️ Avisos de pago sin resolver\n")
        for x in wh:
            w(f"- {x['recibido_en'][:16]} · {x['evento']} · **{x['estado']}** · {x['nota']}")
    print("\n".join(out))


if __name__ == "__main__":
    main()
