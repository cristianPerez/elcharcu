/**
 * El reporte diario de PRODUCCIÓN de El Charcu: suscriptores (lo primero), a
 * quién hacerle seguimiento, y qué le preguntaron al Charcu AI y cómo respondió.
 *
 *   pnpm -s reporte:diario               → reporte de ayer (hora de Bogotá)
 *   pnpm -s reporte:diario 2026-11-07    → reporte de ese día
 *
 * Lo usa la skill `reporte-diario`. Imprime el reporte en Markdown y lo guarda
 * en `reportes/diario/AAAA-MM-DD.md`, más `AAAA-MM-DD-chat.json` con las
 * conversaciones COMPLETAS del día para analizarlas (carpeta fuera de git:
 * tiene correos, nombres y lo que la gente escribió).
 *
 * ⚠️ SOLO LEE (GET por PostgREST con `.env.prod`). No escribe nada.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/* ── Entorno: SIEMPRE producción ─────────────────────────────────────────── */
const env = {};
for (const linea of readFileSync('.env.prod', 'utf8').split('\n')) {
  const m = linea.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const SUPA = env.SUPABASE_URL;
const CLAVE = env.SUPABASE_SECRET_KEY;
if (!SUPA || !CLAVE) {
  console.error('Falta SUPABASE_URL o SUPABASE_SECRET_KEY en .env.prod');
  process.exit(1);
}

/* ── Fechas en hora de Bogotá (UTC-5, sin horario de verano) ─────────────── */
const DESFASE = 5 * 3600e3;
const DIA_MS = 864e5;
const diaBogota = (iso) => new Date(new Date(iso).getTime() - DESFASE).toISOString().slice(0, 10);
const horaBogota = (iso) => new Date(new Date(iso).getTime() - DESFASE).toISOString().slice(11, 16);
const hoy = diaBogota(new Date().toISOString());
const sumarDias = (dia, n) => new Date(Date.parse(`${dia}T00:00:00Z`) + n * DIA_MS).toISOString().slice(0, 10);
const DIA = /^\d{4}-\d{2}-\d{2}$/.test(process.argv[2] ?? '') ? process.argv[2] : sumarDias(hoy, -1);
const SEMANA_DESDE = sumarDias(DIA, -6);
const FIN_DIA = Date.parse(`${DIA}T00:00:00Z`) + DESFASE + DIA_MS; // medianoche de Bogotá al final del día
const diasEntre = (desde, hasta) => Math.floor((hasta - desde) / DIA_MS);

/* ── Cuentas que NO son clientes (Cristian y familia, ver memoria) ───────── */
const INTERNOS = new Set(['cperez354@gmail.com', 'tecedel@gmail.com', 'mcamilazapataf@gmail.com', 'ing.ceaf@gmail.com']);
const esInterno = (email) => INTERNOS.has((email ?? '').toLowerCase()) || /@(elcharcu\.co|goingtube\.com|onepay\.ai)$/i.test(email ?? '');

/* ── Supabase ────────────────────────────────────────────────────────────── */
const cab = { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` };
async function todas(tabla, select, filtro = '') {
  const filas = [];
  for (let desde = 0; ; desde += 1000) {
    const r = await fetch(`${SUPA}/rest/v1/${tabla}?select=${select}${filtro}`, {
      headers: { ...cab, 'Accept-Profile': 'charcu', Range: `${desde}-${desde + 999}` },
    });
    if (!r.ok) throw new Error(`${tabla}: ${r.status} ${await r.text()}`);
    const lote = await r.json();
    filas.push(...lote);
    if (lote.length < 1000) return filas;
  }
}
async function usuariosAuth() {
  const r = await fetch(`${SUPA}/auth/v1/admin/users?per_page=1000`, { headers: cab });
  if (!r.ok) throw new Error(`auth: ${r.status}`);
  return (await r.json()).users;
}

const desde35 = new Date(FIN_DIA - 35 * DIA_MS).toISOString();
const [auth, perfiles, subs, mensajes, recetas, uso, cupos, progreso, gasto, avisosPago] = await Promise.all([
  usuariosAuth(),
  todas('profiles', 'id,full_name,whatsapp,onboarding_status'),
  todas('subscriptions', 'user_id,status,plan_id,rail,provider,current_period_end,canceled_at,created_at'),
  todas('chat_messages', 'user_id,visitor_id,role,content,image_path,created_at,recipe_id', `&created_at=gte.${desde35}&order=created_at.asc`),
  todas('recipes', 'id,title'),
  todas('usage_counters', 'user_id,period_key,questions_used,images_used'),
  todas('plan_quotas', 'plan_id,questions_per_month'),
  todas('lesson_progress', 'user_id,completed_at,updated_at'),
  todas('ai_spend', 'day,audience,requests,cost_usd', `&day=gte.${sumarDias(DIA, -6)}&day=lte.${DIA}`),
  todas('webhook_eventos', 'evento,estado,nota,recibido_en,cuerpo', '&order=recibido_en.asc'),
]);

const cuenta = new Map(auth.map((u) => [u.id, u]));
const perfil = new Map(perfiles.map((p) => [p.id, p]));
const internos = new Set(auth.filter((u) => esInterno(u.email)).map((u) => u.id));
const visitantesInternos = new Set(mensajes.filter((m) => internos.has(m.user_id)).map((m) => m.visitor_id));
const titulo = new Map(recetas.map((r) => [r.id, r.title]));
const cupo = new Map(cupos.map((c) => [c.plan_id, c.questions_per_month]));
const nombre = (id) => perfil.get(id)?.full_name || cuenta.get(id)?.email?.split('@')[0] || 'sin nombre';
const correo = (id) => cuenta.get(id)?.email ?? '—';
const conWhatsapp = (id) => Boolean(perfil.get(id)?.whatsapp);
const mesDe = (dia) => dia.slice(0, 7);

const reales = mensajes.filter((m) => !internos.has(m.user_id) && !visitantesInternos.has(m.visitor_id));
const preguntas = reales.filter((m) => m.role === 'user');

/* ── Actividad por cuenta ────────────────────────────────────────────────── */
const ultimaActividad = new Map();
const tocar = (id, iso) => {
  if (id && iso && Date.parse(iso) < FIN_DIA && (!ultimaActividad.has(id) || iso > ultimaActividad.get(id))) ultimaActividad.set(id, iso);
};
for (const m of preguntas) tocar(m.user_id, m.created_at);
for (const p of progreso) tocar(p.user_id, p.updated_at);
for (const u of auth) tocar(u.id, u.last_sign_in_at);
const preguntasDe = (id, desdeIso) => preguntas.filter((m) => m.user_id === id && m.created_at >= desdeIso && Date.parse(m.created_at) < FIN_DIA).length;
const usoMes = (id) => uso.find((u) => u.user_id === id && u.period_key === mesDe(DIA))?.questions_used ?? 0;

/* ── Suscriptores ────────────────────────────────────────────────────────── */
const esPrueba = (w) => /prueba/i.test(JSON.stringify(w.cuerpo?.subscription?.name ?? w.cuerpo?.subscription?.description ?? ''));
const suscriptores = subs
  .filter((s) => s.status === 'active' && s.plan_id && !internos.has(s.user_id))
  .map((s) => {
    const fin = s.current_period_end ? Date.parse(s.current_period_end) : null;
    const quedan = fin === null ? null : Math.ceil((fin - FIN_DIA) / DIA_MS);
    const ultima = ultimaActividad.get(s.user_id) ?? null;
    const sinUsar = ultima ? diasEntre(Date.parse(ultima), FIN_DIA) : null;
    const automatica = s.provider === 'onepay' && !s.canceled_at;
    const como = s.provider === 'onepay' ? 'OnePay' : s.rail === 'cortesia' ? 'Cortesía' : s.rail ? `Manual (${s.rail})` : 'Manual';
    const vigente = quedan !== null && quedan >= 0;
    const semaforo = !vigente ? '⚫' : sinUsar === null || sinUsar >= 7 ? '🔴' : sinUsar >= 3 ? '🟡' : '🟢';
    return { ...s, quedan, ultima, sinUsar, automatica, como, vigente, semaforo,
      nuevo: diasEntre(Date.parse(s.created_at), FIN_DIA) <= 3,
      preguntasDia: preguntasDe(s.user_id, new Date(FIN_DIA - DIA_MS).toISOString()),
      preguntas30: preguntasDe(s.user_id, new Date(FIN_DIA - 30 * DIA_MS).toISOString()),
      lecciones: progreso.filter((p) => p.user_id === s.user_id && p.completed_at).length,
      cupoUsado: usoMes(s.user_id), cupoTotal: cupo.get(s.plan_id) ?? null };
  })
  .sort((a, b) => Number(b.vigente) - Number(a.vigente) || (a.quedan ?? 0) - (b.quedan ?? 0));

/* ── A quién hacerle seguimiento ─────────────────────────────────────────── */
const seguimiento = [];
const anotar = (id, prioridad, motivo, idea) => seguimiento.push({ id, prioridad, motivo, idea });
for (const s of suscriptores) {
  if (s.vigente && s.nuevo) anotar(s.user_id, 1, `Suscriptor nuevo (${s.plan_id}, ${s.como})`, 'Bienvenida personal: preguntarle qué quiere curar primero y mostrarle el curso que le sirve.');
  if (s.vigente && (s.sinUsar === null || s.sinUsar >= 5)) anotar(s.user_id, 1, `Paga y no usa El Charcu hace ${s.sinUsar ?? '?'} días`, 'Reactivar con algo concreto de lo último que preguntó o de su curso a medias.');
  if (!s.automatica && s.quedan !== null && s.quedan <= 7 && s.quedan >= -14) anotar(s.user_id, 1, s.quedan < 0 ? `Su plan venció hace ${-s.quedan} días y no renovó` : `Su plan vence en ${s.quedan} días y no se renueva solo`, 'Renovación por OnePay (aviso de renovación / mensaje directo).');
  if (s.vigente && s.cupoTotal && s.cupoUsado >= 0.8 * s.cupoTotal) anotar(s.user_id, 2, `Usó ${s.cupoUsado}/${s.cupoTotal} preguntas del mes`, 'Uso muy alto: candidato a Maestro, o revisar si algo lo hace preguntar de más.');
}
// Exsuscriptores: los pasados a gratis (`free` con `rail`) cuyo plan venció hace ≤14 días.
for (const s of subs.filter((x) => x.status === 'free' && x.rail && x.current_period_end && !internos.has(x.user_id))) {
  const hace = Math.floor((FIN_DIA - Date.parse(s.current_period_end)) / DIA_MS);
  if (hace >= 0 && hace <= 14) anotar(s.user_id, 1, `Exsuscriptor: su plan (${s.rail}) venció hace ${hace} días y volvió a gratis`, 'Invitarlo a volver con los enlaces de OnePay, hablando de lo último que hizo.');
}
const pagadores = new Set(suscriptores.filter((s) => s.vigente).map((s) => s.user_id));
for (const u of uso.filter((x) => x.period_key === mesDe(DIA) && x.user_id && !pagadores.has(x.user_id) && !internos.has(x.user_id))) {
  if (u.questions_used >= 6) anotar(u.user_id, 2, `Plan gratis: ${u.questions_used}/8 preguntas este mes`, 'Ofrecer el Pro con un ejemplo de lo que ya preguntó.');
}
for (const u of auth.filter((x) => diaBogota(x.created_at) === DIA && !internos.has(x.id) && !x.email_confirmed_at)) {
  anotar(u.id, 3, 'Se registró ayer y no confirmó el correo', 'Escribirle para ayudarle a entrar (¿le llegó el enlace? ¿correo bien escrito?).');
}

/* ── Conversaciones del día con el Charcu AI ─────────────────────────────── */
const delDia = reales.filter((m) => diaBogota(m.created_at) === DIA);
const tipoDe = (m) => (m.user_id ? (pagadores.has(m.user_id) ? 'suscriptor' : 'gratis') : 'anónimo');
const quienDe = (m) => (m.user_id ? `${nombre(m.user_id)} <${correo(m.user_id)}>` : `visitante ${String(m.visitor_id).slice(0, 8)}`);
const pares = [];
for (const [i, m] of delDia.entries()) {
  if (m.role !== 'user') continue;
  const misma = (x) => x.recipe_id === m.recipe_id && (x.user_id ?? x.visitor_id) === (m.user_id ?? m.visitor_id);
  const respuesta = delDia.slice(i + 1).find((x) => misma(x));
  pares.push({
    hora: horaBogota(m.created_at), tipo: tipoDe(m), quien: quienDe(m), conversacion: titulo.get(m.recipe_id) ?? null,
    pregunta: m.content, foto: Boolean(m.image_path),
    respuesta: respuesta?.role === 'assistant' ? respuesta.content : null,
  });
}
const orden = { suscriptor: 0, gratis: 1, anónimo: 2 };
pares.sort((a, b) => orden[a.tipo] - orden[b.tipo] || a.quien.localeCompare(b.quien) || a.hora.localeCompare(b.hora));

/* Señales automáticas: el análisis de verdad lo hace quien corre la skill. */
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
const semana = preguntas.filter((m) => diaBogota(m.created_at) >= SEMANA_DESDE && diaBogota(m.created_at) <= DIA);
const repetidas = [...semana.reduce((mapa, m) => mapa.set(norm(m.content), (mapa.get(norm(m.content)) ?? 0) + 1), new Map())]
  .filter(([t, n]) => n >= 2 && t.length > 10).sort((a, b) => b[1] - a[1]).slice(0, 8);
const sinRespuesta = pares.filter((p) => p.respuesta === null);
const largas = pares.filter((p) => (p.respuesta ?? '').length > 1400);
const devuelvePregunta = pares.filter((p) => /\?\s*$/.test(p.respuesta ?? '') && (p.respuesta ?? '').length < 400);

/* ── Pagos, gasto y cuentas ──────────────────────────────────────────────── */
const pagosDia = avisosPago.filter((w) => w.evento === 'subscription.paid' && diaBogota(w.recibido_en) === DIA);
const pendientes = avisosPago.filter((w) => !['procesado'].includes(w.estado) && !esPrueba(w));
const cuentasDia = auth.filter((u) => diaBogota(u.created_at) === DIA && !internos.has(u.id));
const gastoDia = gasto.filter((g) => g.day === DIA).reduce((s, g) => s + Number(g.cost_usd), 0);
const gastoSemana = gasto.reduce((s, g) => s + Number(g.cost_usd), 0);
const usd = (n) => `US$ ${n.toFixed(2)}`;

/* ── El reporte ──────────────────────────────────────────────────────────── */
const md = [];
const L = (s = '') => md.push(s);
L(`# Reporte diario de El Charcu — ${DIA}`);
L(`_elcharcu.co · hora de Bogotá · generado ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · sin cuentas internas_`);
L();
L('## Resumen del día');
L(`- **Suscriptores vigentes:** ${suscriptores.filter((s) => s.vigente).length} (${suscriptores.filter((s) => s.vigente && s.automatica).length} con renovación automática por OnePay)`);
L(`- **Pagos recibidos:** ${pagosDia.length}${pagosDia.some(esPrueba) ? ' (incluye pruebas)' : ''} · **Cuentas nuevas:** ${cuentasDia.length} (${cuentasDia.filter((u) => u.email_confirmed_at).length} confirmadas)`);
L(`- **Preguntas al Charcu AI:** ${pares.length} de ${new Set(pares.map((p) => p.quien)).size} personas · suscriptores ${pares.filter((p) => p.tipo === 'suscriptor').length} · gratis ${pares.filter((p) => p.tipo === 'gratis').length} · anónimos ${pares.filter((p) => p.tipo === 'anónimo').length} · con foto ${pares.filter((p) => p.foto).length}`);
L(`- **Gasto de IA:** ${usd(gastoDia)} el día · ${usd(gastoSemana)} en 7 días`);
L();
L('## ⭐ Suscriptores');
if (suscriptores.length === 0) L('_Nadie con plan activo._');
else {
  L('| | Quién | Plan · cómo paga | Vence | Último uso | Preguntas (día / 30 d) | Cupo del mes | Lecciones |');
  L('|---|---|---|---|---|---:|---:|---:|');
  for (const s of suscriptores) {
    const vence = s.quedan === null ? '—' : s.quedan < 0 ? `venció hace ${-s.quedan} d` : `en ${s.quedan} d${s.automatica ? ' (se renueva sola)' : ''}`;
    const ultimo = s.ultima ? `${diaBogota(s.ultima)} (hace ${s.sinUsar} d)` : 'nunca';
    L(`| ${s.semaforo} | **${nombre(s.user_id)}** <${correo(s.user_id)}>${conWhatsapp(s.user_id) ? ' 📱' : ''} | ${s.plan_id} · ${s.como} | ${vence} | ${ultimo} | ${s.preguntasDia} / ${s.preguntas30} | ${s.cupoUsado}/${s.cupoTotal ?? '?'} | ${s.lecciones} |`);
  }
  L('');
  L('🟢 usa El Charcu (≤2 días) · 🟡 3-6 días sin usar · 🔴 7+ días o nunca · ⚫ plan vencido (sigue marcado `active`) · 📱 dejó WhatsApp');
}
L();
L('## 🤝 A quién hacerle seguimiento');
if (seguimiento.length === 0) L('_Nadie hoy._');
for (const f of seguimiento.sort((a, b) => a.prioridad - b.prioridad)) {
  L(`- **P${f.prioridad} · ${nombre(f.id)}** <${correo(f.id)}>${conWhatsapp(f.id) ? ' 📱' : ''} — ${f.motivo}. _${f.idea}_`);
}
L();
L(`## 💬 Qué le preguntaron al Charcu AI (${pares.length})`);
if (pares.length === 0) L('_Nadie preguntó ese día._');
let actual = '';
for (const p of pares) {
  if (p.quien !== actual) {
    actual = p.quien;
    L(`\n**${p.tipo === 'suscriptor' ? '⭐ ' : ''}${p.quien}** · ${p.tipo}${p.conversacion ? ` · «${p.conversacion}»` : ''}`);
  }
  L(`- ${p.hora} ${p.foto ? '📷 ' : ''}**P:** ${p.pregunta.replace(/\s+/g, ' ').slice(0, 300)}`);
  L(`  **R:** ${p.respuesta === null ? '⚠️ SIN RESPUESTA guardada' : p.respuesta.replace(/\s+/g, ' ').slice(0, 260) + (p.respuesta.length > 260 ? '…' : '')}`);
}
L();
L('## 🔧 Señales para mejorar el Charcu AI');
L(`- Preguntas sin respuesta guardada: **${sinRespuesta.length}**`);
L(`- Respuestas muy largas (>1.400 caracteres): **${largas.length}**`);
L(`- Respuestas cortas que solo devuelven una pregunta: **${devuelvePregunta.length}**`);
L(`- Preguntas repetidas en 7 días (candidatas a respuesta fija o a receta): ${repetidas.length ? repetidas.map(([t, n]) => `«${t.slice(0, 70)}» ×${n}`).join(' · ') : 'ninguna'}`);
L('_Las conversaciones completas están en el JSON del día: el análisis de calidad lo hace quien corre la skill._');
L();
L('## Avisos');
const avisos = [];
for (const w of pendientes) avisos.push(`⚠️ Aviso de pago en estado **${w.estado}** (${diaBogota(w.recibido_en)}): ${w.nota ?? ''} → alguien pudo pagar sin acceso → revisarlo en webhook_eventos.`);
for (const s of suscriptores.filter((x) => !x.vigente)) avisos.push(`⚠️ ${nombre(s.user_id)} sigue en \`active\` con el plan vencido hace ${-s.quedan} días → no tiene acceso de verdad → decidir si renueva o pasarlo a gratis.`);
if (pagosDia.some((w) => !esPrueba(w))) avisos.push(`🎉 Entraron ${pagosDia.filter((w) => !esPrueba(w)).length} pagos reales.`);
if (sinRespuesta.length) avisos.push(`⚠️ ${sinRespuesta.length} preguntas quedaron sin respuesta → el asistente falló → mirar logs de /api/asistente.`);
L(avisos.length ? avisos.join('\n') : 'Nada raro.');

const texto = md.join('\n');
mkdirSync('reportes/diario', { recursive: true });
writeFileSync(`reportes/diario/${DIA}.md`, `${texto}\n`);
writeFileSync(`reportes/diario/${DIA}-chat.json`, JSON.stringify({ dia: DIA, pares }, null, 1));
console.log(texto);
