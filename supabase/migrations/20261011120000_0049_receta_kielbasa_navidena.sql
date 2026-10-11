-- 0049 — Receta: Kielbasa Navideña (2026-10-11)
--
-- Del post de Instagram de El Charcu y las indicaciones de Cristian: la base
-- de carne y condimentos de la kielbasa de mozzarella y jalapeño (2 kg), en
-- tres días: masa + 24 h de cura; pedazos, embutido + 24 h para que la tripa
-- se pegue; ahumado y cocción.
-- Lo que NO venía y se decidió aquí (revisar con Cristian):
--   · 70 g de arándanos y 70 g de maní: los 140 g del jalapeño, repartidos.
--   · maní tostado sin sal (para no mover la sal de la receta).
--   · 72 °C internos y tripa natural 32–38 mm, como la receta base.
--   · origin "Polonia · 2 kg" y tags Polonia/Ahumado/Queso, como la base.
--   · aviso de alérgeno por el maní.

insert into charcu.recetario
  (slug, name, category, tags, image, origin, capsule_slug, content, position)
values
  ('kielbasa-navidena', 'Kielbasa Navideña', 'chorizos', '{"Polonia","Ahumado","Queso"}',
   '/recipes/kielbasa-navidena.jpg', 'Polonia · 2 kg', 'embutir-un-chorizo',
   $receta${
  "slug": "kielbasa-navidena",
  "name": "Kielbasa Navideña",
  "description": "Nuestra kielbasa artesanal en versión navideña: cerdo picado a cuchillo con cubos de mozzarella, arándanos secos y maní en trozos, en tres días y ahumada hasta 72 °C.",
  "image": "/recipes/kielbasa-navidena.jpg",
  "tags": [
    "Polonia",
    "Ahumado",
    "Queso"
  ],
  "eyebrow": "Receta · Chorizos del mundo",
  "subtitle": "Mozzarella, arándanos y maní, en tres días y ahumada.",
  "intro": "La misma base de nuestra kielbasa artesanal —70% de cerdo picado a cuchillo, 30% molido fino, los mismos condimentos y proporciones— vestida para la mesa de Navidad. Se trabaja en tres días: el primero solo carne, condimentos y agua helada, amasando hasta la liga, y 24 horas de cura en frío. El segundo entran la mozzarella congelada, los arándanos secos y el maní picado, con la mano suave, y se embute; otras 24 horas en frío para que la tripa se pegue a la carne. El tercero, al ahumador. Al cortarla aparecen los cubos de queso, el rojo del arándano y el maní tostado repartidos en una masa de grano grueso.",
  "stats": [
    {
      "label": "Rendimiento base",
      "value": "2 kg de carne"
    },
    {
      "label": "Tipo",
      "value": "Ahumada y cocida"
    },
    {
      "label": "Nivel",
      "value": "Intermedio"
    },
    {
      "label": "Proceso",
      "value": "3 días"
    },
    {
      "label": "Reposos en frío",
      "value": "24 h + 24 h"
    },
    {
      "label": "Molienda",
      "value": "70% cuchillo, 30% fina"
    },
    {
      "label": "Temperatura interna",
      "value": "72 °C"
    },
    {
      "label": "Tipo de tripa",
      "value": "Natural, cal. 32–38 mm"
    }
  ],
  "details": [
    {
      "title": "Base",
      "description": "La de nuestra kielbasa artesanal: 1400 g de cerdo picado a cuchillo y 600 g molido fino, con los mismos condimentos."
    },
    {
      "title": "Lo que va dentro",
      "description": "Cubos de mozzarella congelada, arándanos secos en trozos y maní picado a 3–5 mm."
    },
    {
      "title": "Sabor",
      "description": "Ajo, pimienta y coriandro de base; el dulce ácido del arándano, el tostado del maní y el queso fundido."
    }
  ],
  "quote": "La carne se cura sola un día entero; los pedazos entran después. Así cada uno llega entero al corte.",
  "ingredientsNote": "La carne, la sal, la sal de cura y los condimentos son los de nuestra kielbasa de mozzarella y jalapeño: aquí el jalapeño se cambia por arándanos y maní. La mozzarella, los arándanos y el maní entran el segundo día, después de las 24 horas de cura, nunca en el amasado del primero. El maní es un alérgeno: avísalo a quien la vaya a comer.",
  "ingredients": [
    {
      "name": "Carne de cerdo picada a cuchillo",
      "amount": "1400 g",
      "pct": "70%"
    },
    {
      "name": "Carne de cerdo molida fina",
      "amount": "600 g",
      "pct": "30%"
    },
    {
      "name": "Sal",
      "amount": "30 g",
      "pct": "1.5%"
    },
    {
      "name": "Sal de cura #1 (Prague Powder #1)",
      "amount": "5 g",
      "pct": "0.25%"
    },
    {
      "name": "Azúcar",
      "amount": "3.3 g",
      "pct": "0.165%"
    },
    {
      "name": "Ajo en polvo",
      "amount": "2.7 g",
      "pct": "0.135%"
    },
    {
      "name": "Pimienta negra",
      "amount": "1.75 g",
      "pct": "0.088%"
    },
    {
      "name": "Coriandro molido",
      "amount": "1 g",
      "pct": "0.05%"
    },
    {
      "name": "Paprika dulce",
      "amount": "1 g",
      "pct": "0.05%"
    },
    {
      "name": "Nuez moscada",
      "amount": "0.2 g",
      "pct": "0.01%"
    },
    {
      "name": "Agua helada",
      "amount": "100 ml",
      "pct": "5%"
    },
    {
      "name": "Mozzarella en cubos de 5–7 mm, congelada",
      "amount": "120 g",
      "pct": "6%"
    },
    {
      "name": "Arándanos secos, en trozos pequeños",
      "amount": "70 g",
      "pct": "3.5%"
    },
    {
      "name": "Maní tostado sin sal, picado a 3–5 mm",
      "amount": "70 g",
      "pct": "3.5%"
    }
  ],
  "proportionNote": "70% picada a cuchillo y 30% molida fina, como nuestra kielbasa artesanal: el grano grueso da la mordida y el molido fino la liga que sostiene los pedazos. Mozzarella, arándanos y maní suman 260 g, un 13% sobre la carne: se ven en cada tajada sin que la masa pierda la liga.",
  "charcuteroNote": "El porcentaje es el peso sobre los 2 kg de carne. Valores por kilo: sal 15 g, sal de cura #1 2,5 g, azúcar 1,65 g, ajo en polvo 1,35 g, pimienta negra 0,875 g, coriandro 0,5 g, paprika dulce 0,5 g, nuez moscada 0,1 g, agua helada 50 ml, mozzarella 60 g, arándanos 35 g y maní 35 g. Los 2,5 g de Prague Powder #1 por kilo equivalen a 156 ppm de nitrito de entrada, el nivel estándar para un embutido cocido — y también el techo. Si tu sal de cura tiene otra concentración de nitrito, la dosis no es la misma.",
  "steps": [
    {
      "n": "01",
      "text": "Día 1 — Pica 1400 g de cerdo a cuchillo y muele finos los 600 g restantes. Todo muy frío."
    },
    {
      "n": "02",
      "text": "Día 1 — Junta las dos texturas y agrega la sal, la sal de cura #1, el azúcar, el ajo en polvo, la pimienta negra, el coriandro, la paprika dulce, la nuez moscada y los 100 ml de agua helada."
    },
    {
      "n": "03",
      "text": "Día 1 — Amasa hasta desarrollar la liga: la masa tiene que quedar homogénea, pegajosa y agarrándose a la mano."
    },
    {
      "n": "04",
      "text": "Día 1 — Corta la mozzarella en cubos de 5–7 mm y congélala. Cubre la masa y llévala a la nevera 24 horas."
    },
    {
      "n": "05",
      "text": "Día 2 — Pica los arándanos secos si son grandes y el maní en trozos de 3–5 mm."
    },
    {
      "n": "06",
      "text": "Día 2 — Con la carne bien fría, agrega la mozzarella congelada, los arándanos y el maní. Mezcla suave, solo hasta repartirlos, sin romper los cubos de queso."
    },
    {
      "n": "07",
      "text": "Día 2 — Embute parejo, sin bolsas de aire grandes y sin sobrellenar la tripa."
    },
    {
      "n": "08",
      "text": "Día 2 — Lleva las kielbasas a la nevera otras 24 horas, para que la tripa se pegue a la carne."
    },
    {
      "n": "09",
      "text": "Día 3 — Ahúma y cocina subiendo la temperatura por escalones, sin golpes de calor."
    },
    {
      "n": "10",
      "text": "Día 3 — Controla con sonda en el centro de la pieza más gruesa hasta 72 °C internos."
    },
    {
      "n": "11",
      "text": "Enfría rápido, seca la superficie y refrigera antes de cortar."
    }
  ],
  "tips": [
    {
      "title": "El queso, congelado antes de embutir",
      "description": "Córtalo en cubos y congélalo el Día 1. Congelado aguanta la mezcla y el embutido sin deshacerse, y funde dentro de la tripa, en la cocción."
    },
    {
      "title": "Los pedazos, después de la cura",
      "description": "La carne pasa sus 24 horas solo con los condimentos de base. La mozzarella, los arándanos y el maní se revuelven el Día 2: si entran en el amasado del Día 1, se deshacen y engrasan la masa."
    },
    {
      "title": "24 horas para que la tripa se pegue",
      "description": "Ese reposo después de embutir hace que la tripa se adhiera a la carne. Al ahumar y al cortar, no se despega."
    },
    {
      "title": "No sobrellenes la tripa",
      "description": "La mozzarella funde y ocupa más. Embute con margen: es lo que evita que revienten en la cocción."
    },
    {
      "title": "Calor progresivo, nunca de golpe",
      "description": "Una temperatura alta de entrada funde el queso antes de que la masa cuaje. Sube por escalones."
    }
  ],
  "cookMethods": [
    {
      "title": "Ahumada y cocida",
      "description": "El método de la receta: humo progresivo hasta 72 °C en el centro. Queda lista para comer."
    },
    {
      "title": "A la parrilla",
      "description": "Ya cocida, solo dorar unos minutos a fuego medio. Fuego fuerte revienta la tripa por el queso."
    },
    {
      "title": "En tajadas, para la mesa",
      "description": "Fría y en tajadas gruesas: se ven los cubos de queso, el arándano y el maní."
    }
  ],
  "recommendations": [
    "Congela la mozzarella en cubos antes de embutir.",
    "Revuelve los arándanos, el maní y el queso después de las 24 horas de cura.",
    "Deja 24 horas en frío después de embutir para que la tripa se pegue.",
    "Ahúma subiendo por escalones y mide con sonda hasta 72 °C internos."
  ],
  "resultNote": "El resultado: una kielbasa de grano grueso y jugosa, con los cubos de mozzarella fundidos, el rojo del arándano y el maní tostado repartidos en cada tajada. Llena de contrastes, para la mesa de Navidad.",
  "finalQuote": "Tres días que se notan en el corte: la carne curada sola, los pedazos enteros y la tripa pegada.",
  "finalQuoteCaption": "Consejo de El Charcu"
}$receta$::jsonb,
   (select coalesce(max(position), 0) + 10 from charcu.recetario))
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tags = excluded.tags,
  image = excluded.image, origin = excluded.origin,
  capsule_slug = excluded.capsule_slug, content = excluded.content;

update charcu.recetario r set course_slug = c.slug
  from charcu.courses c
 where c.slug = r.slug and c.kind = 'curso' and r.slug = 'kielbasa-navidena';
