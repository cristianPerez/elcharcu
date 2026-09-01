import { type Ingredient, type LabelValue } from '@/entities/recipe';

export interface RecipeDoubt {
  /** Lo que se lee en el botón: la duda tal como la tendría en la cabeza. */
  readonly label: string;
  /** Lo que se le manda al asistente cuando la toca. */
  readonly prompt: string;
}

export interface RecipeDoubts {
  /** Tras la intro: escalar la receta a la carne que de verdad tiene. */
  readonly onIntro: RecipeDoubt;
  /** Junto a la tabla: la sal de cura, o las proporciones si no lleva. */
  readonly onIngredients: RecipeDoubt;
  /** Cerrando los pasos: la espera, que es donde nadie te dice si va bien. */
  readonly onProcess: RecipeDoubt;
  /** Al final: la foto, que es la función que más impresiona. */
  readonly onServing: RecipeDoubt;
}

/**
 * Delata la sal de cura por el nombre del ingrediente.
 *
 * ⚠️ Va apretada a propósito: `cura` a secas también casa con "queso cheddar
 * CURAdo", y con eso los chorizos con queso salían preguntando por nitritos que
 * no llevan.
 */
const CURE_SALT = /sal de cura|nitrit|prague|praga/i;

/** Las etiquetas de lo que se seca durante semanas, no de lo que se come hoy. */
const DRY_CURED = /curado/i;

interface RecipeFacts {
  readonly name: string;
  readonly ingredients: readonly Ingredient[];
  readonly tags: readonly string[];
  readonly stats: readonly LabelValue[];
  /** Dudas escritas a mano que ganan a las generadas. Ninguna es obligatoria. */
  readonly doubts?: Partial<Record<keyof RecipeDoubts, RecipeDoubt>> | undefined;
}

/**
 * Hasta dónde puede crecer un valor antes de no caber en un botón.
 *
 * ⚠️ Los valores de las stats van de "1 kg" a "4 L de leche → 4–5 burratas de
 * ~120 g". Metido en la etiqueta, el segundo daba un botón de 70 caracteres que
 * no se lee de un vistazo — que es lo único que un botón tiene que hacer. Si el
 * dato no cabe, la etiqueta se queda corta y el dato viaja en la PREGUNTA, que
 * sí lo aprovecha entero.
 */
const CABE_EN_UN_BOTON = 14;

/** El valor de una stat por su etiqueta, o `null` si esta receta no la trae. */
function stat(stats: readonly LabelValue[], label: RegExp): string | null {
  return stats.find((item) => label.test(item.label))?.value ?? null;
}

/**
 * Las cuatro dudas que se le ofrecen a quien está leyendo una receta.
 *
 * ⚠️ SE GENERAN, y es una decisión, no una pereza. Escribir cuatro preguntas a
 * mano para 45 recetas son 180 frases que hay que mantener al día cada vez que
 * cambie un gramaje — y que envejecen en silencio, porque nadie relee las
 * preguntas de la receta 31. Generarlas desde los datos las mantiene ciertas
 * solas: si mañana el salami pasa de 4–10 semanas a 6, la pregunta lo dice sin
 * que nadie la toque.
 *
 * Y no son genéricas: usan los VALORES de esta receta —su rendimiento base, su
 * tipo de sal de cura, sus semanas de curado, su calibre de tripa—, así que
 * "¿cuánto rinde?" se convierte en "rinde 1 kg y yo tengo 3".
 *
 * Cuando una merezca estar mejor escrita, se pone a mano en el JSON de la
 * receta (`doubts`) y esa gana. Sin bloquear a las otras 44.
 */
export function recipeDoubts(recipe: RecipeFacts): RecipeDoubts {
  const hasCureSalt = recipe.ingredients.some((item) => CURE_SALT.test(item.name));
  const isDryCured = recipe.tags.some((tag) => DRY_CURED.test(tag));

  const yield_ = stat(recipe.stats, /rendimiento/i);
  const casing = stat(recipe.stats, /tripa/i);
  const curing = stat(recipe.stats, /^curado$|^secado$|^maduraci[óo]n$/i);
  const smoking = stat(recipe.stats, /ahumado/i);

  const cureName =
    recipe.ingredients.find((item) => CURE_SALT.test(item.name))?.name ?? 'sal de cura';

  const generated: RecipeDoubts = {
    // 1 · Escalar. Es la primera duda real de cualquiera que va a cocinar:
    //     la receta dice una cantidad y su carne pesa otra.
    onIntro:
      yield_ === null
        ? {
            label: '¿Por dónde empiezo?',
            prompt: `Quiero hacer ${recipe.name} y es la primera vez. ¿Qué necesito tener listo antes de empezar y en qué orden lo hago?`,
          }
        : {
            label:
              yield_.length <= CABE_EN_UN_BOTON
                ? `Rinde ${yield_}. ¿Y si tengo otra cantidad?`
                : '¿Y si quiero hacer otra cantidad?',
            prompt: `La receta de ${recipe.name} está para ${yield_}. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?`,
          },

    // 2 · La sal de cura. Es la única parte que puede hacer daño de verdad.
    onIngredients: hasCureSalt
      ? {
          label: '¿Y si me paso con la sal de cura?',
          prompt: `${recipe.name} lleva ${cureName}. ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?`,
        }
      : {
          label: '¿Puedo cambiar algún ingrediente?',
          prompt: `Estoy haciendo ${recipe.name} y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?`,
        },

    // 3 · La espera. Semanas sin que nadie te diga si va bien, o el punto
    //     exacto en lo que se come el mismo día.
    onProcess: isDryCured
      ? {
          label: '¿Cómo sé si se está secando bien?',
          prompt: `Estoy curando mi ${recipe.name}${curing === null ? '' : ` (la receta dice ${curing})`}. ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?`,
        }
      : {
          label: '¿Cómo sé que quedó en su punto?',
          prompt: `Hice ${recipe.name}${smoking === null ? '' : ` (con ahumado: ${smoking})`}. ¿Cómo sé que está bien por dentro sin que me quede seco?`,
        },

    // 4 · El final. Ya lo tiene hecho o casi: aquí se ofrece la foto, que es
    //     lo que más impresiona y lo que hace volver a mitad de un curado.
    //
    //     ⚠️ Aquí llegó a interpolarse el calibre de la tripa y salía una
    //     etiqueta de 70 caracteres —"¿Sirve otra tripa que no sea colágeno o
    //     natural de res, cal. 55–60 mm?"—. Un botón no es una frase: el dato
    //     largo va en la PREGUNTA, que sí lo aprovecha, y el botón se queda
    //     corto para poder leerse de un vistazo.
    onServing: {
      label: 'Mándale una foto de cómo va',
      prompt: `Te voy a mandar una foto de mi ${recipe.name}${casing === null ? '' : ` (tripa de ${casing})`} para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.`,
    },
  };

  return { ...generated, ...recipe.doubts };
}
