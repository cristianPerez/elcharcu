-- 0052 · El correo de bienvenida de un pago, una sola vez (2026-10-19).
--
-- Cuando OnePay avisa un pago, el webhook activa la suscripción y manda un
-- correo con el botón para entrar. Si la persona no tenía cuenta, el webhook la
-- crea con el correo que guardó OnePay. Esta columna decide quién manda el
-- correo: el `update ... where bienvenida_enviada_el is null` lo gana un solo
-- aviso, aunque OnePay reintente dos a la vez.

alter table charcu.subscriptions
  add column if not exists bienvenida_enviada_el timestamptz;

comment on column charcu.subscriptions.bienvenida_enviada_el is
  'Cuándo salió el correo de bienvenida del primer pago. Null = no ha salido (o falló y se puede reintentar).';
