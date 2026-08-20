-- ============================================================================
-- Captura de leads: nombre, correo y WhatsApp
--
-- Cuando un visitante usa el asistente y ve que funciona, le pedimos sus
-- datos. Es el momento de máximo interés —acaba de comprobar que la app
-- sirve— y todavía no le hemos cobrado nada.
--
-- ⚠️ Esto trata datos personales. Ley 1581 de 2012 (Colombia): hace falta
-- una nota de privacidad visible en el formulario diciendo para qué se usan.
-- ============================================================================

create table charcu.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  whatsapp        text not null,
  created_at      timestamptz not null default now(),
  -- Si después el usuario se registra, se guarda aquí la relación
  user_id         uuid references auth.users(id) on delete set null,
  -- Cuántas preguntas e imágenes había usado cuando dejó los datos
  questions_used  integer not null default 0,
  images_used     integer not null default 0
);

-- Índice para buscar por correo (evitar duplicados, vincular con auth.users)
create index idx_leads_email on charcu.leads(email);
create index idx_leads_user_id on charcu.leads(user_id);

alter table charcu.leads enable row level security;

-- Un visitante anónimo puede dejar sus datos (insertar)
create policy "Cualquiera puede dejar sus datos"
  on charcu.leads for insert
  to anon, authenticated
  with check (true);

-- Un usuario autenticado puede ver sus propios leads
create policy "Los usuarios ven solo sus propios leads"
  on charcu.leads for select
  to authenticated
  using (user_id = auth.uid());

-- Solo el servidor (service_role) puede actualizar o borrar
-- (por ejemplo, para vincular un lead con un usuario tras el registro)
