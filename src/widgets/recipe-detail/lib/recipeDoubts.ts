import { type Ingredient } from '@/entities/recipe';

export interface RecipeDoubt {
  /** Lo que se lee en el botón: la duda tal como la tendría en la cabeza. */
  readonly label: string;
  /** Lo que se le manda al asistente cuando la toca. */
  readonly prompt: string;
}

/**
 * Delata la sal de cura por el nombre del ingrediente.
 *
 * ⚠️ Va apretada a propósito: `cura` a secas también casa con "queso cheddar
 * CURAdo", y con eso los chorizos con queso salían preguntando por nitritos que
 * no llevan. La palabra tiene que ser la sal, no cualquier cosa curada.
 */
const CURE_SALT = /sal de cura|nitrit|prague|praga/i;

/** Las etiquetas de lo que se seca durante días, no de lo que se hace y se come. */
const DRY_CURED = /curado/i;

interface RecipeFacts {
  readonly name: string;
  readonly ingredients: readonly Ingredient[];
  readonly tags: readonly string[];
}

/**
 * Las dos dudas que se le ofrecen a quien está leyendo una receta.
 *
 * Salen del contenido que ya existe, sin nada escrito a mano receta por receta:
 * 45 recetas cubiertas desde el primer día. Cuál toca depende de lo que la
 * receta es DE VERDAD, no de la etiqueta —hay tres chorizos marcados "Fresco"
 * que sí llevan sal de cura—, así que la primera se decide mirando los
 * ingredientes y solo la segunda mira las etiquetas.
 *
 * ⚠️ Son dos, no una por paso. Una duda debajo de cada paso convierte la
 * receta en un pesado que interrumpe a alguien que está leyendo bien. Estos son
 * los dos sitios donde de verdad se duda: la sal de cura, que es la única parte
 * que puede hacer daño, y el secado, que dura semanas sin que nadie te diga si
 * va bien.
 */
export function recipeDoubts(recipe: RecipeFacts): {
  readonly onIngredients: RecipeDoubt;
  readonly onProcess: RecipeDoubt;
} {
  const hasCureSalt = recipe.ingredients.some((item) => CURE_SALT.test(item.name));
  const isDryCured = recipe.tags.some((tag) => DRY_CURED.test(tag));

  return {
    onIngredients: hasCureSalt
      ? {
          label: '¿Y si me paso con la sal de cura?',
          prompt: `Voy a hacer ${recipe.name}. ¿Cuánta sal de cura lleva exactamente para la carne que tengo, y qué pasa si me paso de la cuenta?`,
        }
      : {
          label: '¿Y si mi pieza pesa otra cosa?',
          prompt: `Voy a hacer ${recipe.name}, pero mi carne no pesa lo mismo que dice la receta. ¿Cómo ajusto las cantidades sin arruinarla?`,
        },

    onProcess: isDryCured
      ? {
          label: '¿Cómo sé si se está secando bien?',
          prompt: `Estoy secando mi ${recipe.name} y no sé si va bien. ¿Qué debería ver, tocar y oler estos días, y qué señal quiere decir que hay que tirarlo?`,
        }
      : {
          label: '¿Cómo sé que quedó en su punto?',
          prompt: `Hice ${recipe.name}. ¿Cómo sé que está bien por dentro sin que me quede seco?`,
        },
  };
}
