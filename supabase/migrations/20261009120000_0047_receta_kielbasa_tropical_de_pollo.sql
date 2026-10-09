-- 0047 — Receta: Kielbasa Tropical de Pollo (2026-10-09)
--
-- Del post de Instagram de El Charcu. Escrita con la skill create-recipe.
-- Lo que NO venía en el post y se decidió aquí (revisar con Cristian):
--   · origin "Colombia · 2 kg" y el tag Colombia: el post no dice país; es la
--     versión tropical de la casa.
--   · tripa natural de cerdo, cal. 32–36 mm (como la kielbasa de pollo).
--   · 74 °C internos: el post dice "temperatura interna segura para el pollo".
--   · cocción "sin hervir": el post dice "cocción controlada", sin método.
--   · tips de escurrir el tomate y no sobrellenar la tripa.

insert into charcu.recetario
  (slug, name, category, tags, image, origin, capsule_slug, content, position)
values
  ('kielbasa-tropical-de-pollo', 'Kielbasa Tropical de Pollo', 'chorizos', '{"Colombia","Cocido","Pollo","Queso"}',
   '/recipes/kielbasa-tropical-de-pollo.jpg', 'Colombia · 2 kg', 'embutir-un-chorizo',
   $receta${
  "slug": "kielbasa-tropical-de-pollo",
  "name": "Kielbasa Tropical de Pollo",
  "description": "Kielbasa de pollo cocida con maicitos dulces, cubos de mozzarella y tomate cherry. Picada en procesador, sin llegar a pasta, y cocida en control hasta la temperatura segura del pollo.",
  "image": "/recipes/kielbasa-tropical-de-pollo.jpg",
  "tags": [
    "Colombia",
    "Cocido",
    "Pollo",
    "Queso"
  ],
  "eyebrow": "Receta · Chorizos del mundo",
  "subtitle": "Pollo, maicitos, mozzarella y tomate cherry, cocida en control.",
  "intro": "La kielbasa tropical es una salchicha de pollo jugosa con tropiezos a la vista: maicitos dulces, cubos de mozzarella que se funden al cocer y trocitos de tomate cherry que le dan un punto fresco. La carne se procesa picada, sin volverla pasta, se liga con los condimentos y el agua helada, y se embute en tripa con su forma de herradura. Se cuece en control hasta la temperatura segura del pollo. Pura creatividad charcutera, para compartir.",
  "stats": [
    {
      "label": "Rendimiento base",
      "value": "2 kg de pollo"
    },
    {
      "label": "Tipo",
      "value": "Cocido"
    },
    {
      "label": "Nivel",
      "value": "Intermedio"
    },
    {
      "label": "Molienda",
      "value": "Picada, no pasta"
    },
    {
      "label": "Temperatura interna",
      "value": "74 °C"
    },
    {
      "label": "Tipo de tripa",
      "value": "Natural de cerdo, cal. 32–36 mm"
    }
  ],
  "details": [
    {
      "title": "Base",
      "description": "Pollo picado en procesador: textura de salchicha con mordida, no de pasta lisa."
    },
    {
      "title": "Tropiezos",
      "description": "Maicitos dulces, mozzarella congelada en cubitos y tomate cherry en trozos pequeños, repartidos en cada tajada."
    },
    {
      "title": "Sabor",
      "description": "Suave y redondo — ajo, pimienta negra, cilantro en polvo, paprika dulce y nuez moscada — con el dulce del maíz y el fresco del tomate."
    }
  ],
  "quote": "Cada tropiezo es agua dentro de la tripa: el maíz, el tomate y el queso. Por eso aquí se trabaja frío y se cuece despacio.",
  "ingredientsNote": "La sal de cura #1 debe ser la formulación adecuada para este uso y dosificarse según su etiqueta y la normativa aplicable: no es intercambiable con sal común. Los maicitos, la mozzarella y el tomate entran al final, cuando la masa ya está ligada. La cantidad de maicitos y tomate es una propuesta para esta versión tropical: ajusta el tamaño de los trozos a lo que quieras encontrar al cortar la kielbasa.",
  "ingredients": [
    {
      "name": "Pollo",
      "amount": "2000 g",
      "pct": "100%"
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
      "name": "Cilantro en polvo (coriandro)",
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
      "name": "Azúcar",
      "amount": "3.3 g",
      "pct": "0.165%"
    },
    {
      "name": "Agua helada",
      "amount": "100 ml",
      "pct": "5%"
    },
    {
      "name": "Queso mozzarella congelado, en cubitos",
      "amount": "120 g",
      "pct": "6%"
    },
    {
      "name": "Maicitos dulces escurridos",
      "amount": "150 g",
      "pct": "7.5%"
    },
    {
      "name": "Tomate cherry en trozos pequeños",
      "amount": "150 g",
      "pct": "7.5%"
    }
  ],
  "proportionNote": "Todo se mide sobre los 2 kg de pollo. Los tropiezos —maicitos, mozzarella y tomate— suman 420 g, un 21% sobre la carne: suficiente para que se vean en cada tajada sin que la masa pierda la liga que los sostiene.",
  "charcuteroNote": "El porcentaje es el peso sobre los 2 kg de pollo. Valores por kilo: sal 15 g, sal de cura #1 2,5 g, azúcar 1,65 g, ajo en polvo 1,35 g, pimienta negra 0,875 g, cilantro en polvo 0,5 g, paprika dulce 0,5 g, nuez moscada 0,1 g, agua helada 50 ml, mozzarella 60 g, maicitos 75 g y tomate cherry 75 g. Los 2,5 g de Prague Powder #1 por kilo equivalen a 156 ppm de nitrito de entrada, el nivel estándar para un embutido cocido — y también el techo. Si tu sal de cura tiene otra concentración de nitrito, la dosis no es la misma: manda la etiqueta.",
  "steps": [
    {
      "n": "01",
      "text": "Corta el pollo en trozos pequeños. Trabájalo muy frío."
    },
    {
      "n": "02",
      "text": "Procesa el pollo hasta una textura bien picada, sin convertirlo en una pasta completamente lisa."
    },
    {
      "n": "03",
      "text": "Agrega la sal, la sal de cura #1, el ajo en polvo, la pimienta negra, el cilantro en polvo, la paprika dulce, la nuez moscada, el azúcar y los 100 ml de agua helada."
    },
    {
      "n": "04",
      "text": "Mezcla muy bien hasta obtener una masa homogénea, que se pegue a la mano."
    },
    {
      "n": "05",
      "text": "Incorpora los maicitos dulces escurridos, la mozzarella congelada en cubitos y el tomate cherry en trozos pequeños. Mezcla lo justo para repartirlos."
    },
    {
      "n": "06",
      "text": "Embute en tripa natural de cerdo (32–36 mm), sin sobrellenar, y forma la herradura de la kielbasa."
    },
    {
      "n": "07",
      "text": "Cuece en control, sin hervir, hasta 74 °C en el centro. Mide con termómetro."
    }
  ],
  "tips": [
    {
      "title": "La masa, siempre fría",
      "description": "El pollo es magro y la masa se calienta rápido en el procesador. Si se templa, pierde la liga y queda seca: trabaja con el pollo casi congelado y el agua helada."
    },
    {
      "title": "Tropiezos secos",
      "description": "Escurre bien los maicitos y deja que el tomate suelte su jugo antes de incorporarlo. El agua que sobra se vuelve vapor dentro de la tripa."
    },
    {
      "title": "La mozzarella, congelada",
      "description": "Así se corta en cubitos limpios y no se deshace al mezclar. Funde en la cocción, no antes."
    },
    {
      "title": "Sin sobrellenar",
      "description": "El queso funde y ocupa más. Embute con margen para que la tripa no reviente al cocer."
    }
  ],
  "cookMethods": [
    {
      "title": "Cocción controlada",
      "description": "El método de la receta: calor suave, sin hervir, hasta 74 °C en el centro. Queda lista para comer."
    },
    {
      "title": "A la parrilla",
      "description": "Ya cocida, solo dorar unos minutos a fuego medio. Fuego fuerte revienta la tripa por el queso."
    },
    {
      "title": "A la sartén, en tajadas",
      "description": "Tajadas gruesas doradas un minuto por lado: el queso se tuesta en el corte."
    }
  ],
  "recommendations": [
    "Mantén el pollo y la masa fríos durante toda la preparación.",
    "No proceses el pollo hasta volverlo pasta: debe quedar bien picado.",
    "Dosifica la sal de cura #1 según su etiqueta; no la cambies por sal común.",
    "Cuece hasta 74 °C internos y compruébalo con termómetro."
  ],
  "resultNote": "El resultado: una kielbasa de pollo jugosa y suave, con los maicitos, el tomate y la mozzarella fundida repartidos a la vista en cada tajada. Dulce, fresca y para compartir.",
  "finalQuote": "Una kielbasa tropical se gana en el frío y en el termómetro: masa helada para que ligue, y 74 °C en el centro para que el pollo sea seguro.",
  "finalQuoteCaption": "Consejo de El Charcu"
}$receta$::jsonb,
   (select coalesce(max(position), 0) + 10 from charcu.recetario))
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tags = excluded.tags,
  image = excluded.image, origin = excluded.origin,
  capsule_slug = excluded.capsule_slug, content = excluded.content;

-- Si algún día hay un curso con el mismo slug, se enlaza solo.
update charcu.recetario r set course_slug = c.slug
  from charcu.courses c
 where c.slug = r.slug and c.kind = 'curso' and r.slug = 'kielbasa-tropical-de-pollo';
