import biltong from '../recipes/biltong.json';
import bresaola from '../recipes/bresaola.json';
import bundnerfleisch from '../recipes/bundnerfleisch.json';
import cecinaDeLeon from '../recipes/cecina-de-leon.json';
import charquiDeRes from '../recipes/charqui-de-res.json';
import chistorra from '../recipes/chistorra.json';
import chorizoCantimpalo from '../recipes/chorizo-cantimpalo.json';
import chorizoCriolloArgentino from '../recipes/chorizo-criollo-argentino.json';
import chorizoDeAjo from '../recipes/chorizo-de-ajo.json';
import chorizoIberico from '../recipes/chorizo-iberico.json';
import chorizoParrillero from '../recipes/chorizo-parrillero.json';
import chorizoRiojano from '../recipes/chorizo-riojano.json';
import chorizoSantarrosano from '../recipes/chorizo-santarrosano.json';
import chorizoVenezolano from '../recipes/chorizo-venezolano.json';
import chorizoVerdeMexicano from '../recipes/chorizo-verde-mexicano.json';
import chorizosPicantesJalapenoQuesoCheddar from '../recipes/chorizos-picantes-jalapeno-queso-cheddar.json';
import chouricoPortugues from '../recipes/chourico-portugues.json';
import fuet from '../recipes/fuet.json';
import hamburguesaCerdoEuropea from '../recipes/hamburguesa-cerdo-europea.json';
import jamonAhumadoPicante from '../recipes/jamon-ahumado-picante.json';
import jamonPiernaHorneado from '../recipes/jamon-pierna-horneado.json';
import jamonSelvaNegra from '../recipes/jamon-selva-negra.json';
import kielbasaDePollo from '../recipes/kielbasa-de-pollo.json';
import linguicaCalabresa from '../recipes/linguica-calabresa.json';
import linguicaPortuguesa from '../recipes/linguica-portuguesa.json';
import lomoCurado from '../recipes/lomo-curado.json';
import longanizaColombiana from '../recipes/longaniza-colombiana.json';
import longanizaDominicana from '../recipes/longaniza-dominicana.json';
import longanizaFilipina from '../recipes/longaniza-filipina.json';
import loukaniko from '../recipes/loukaniko.json';
import magretDePatoCurado from '../recipes/magret-de-pato-curado.json';
import merguez from '../recipes/merguez.json';
import mortadelaDePolloCasera from '../recipes/mortadela-de-pollo-casera.json';
import pancetaAhumada from '../recipes/panceta-ahumada.json';
import pastrami from '../recipes/pastrami.json';
import salchichonIberico from '../recipes/salchichon-iberico.json';
import salchichon from '../recipes/salchichon.json';
import sobrasada from '../recipes/sobrasada.json';
import speckAltoAdige from '../recipes/speck-alto-adige.json';
import sujuk from '../recipes/sujuk.json';

import { type Recipe, type RecipeSummary } from './types';

/**
 * Recetas cargadas desde `entities/recipe/recipes/*.json` vía import estático
 * (resolveJsonModule): tipado en compilación contra `Recipe` — sin `any`, sin
 * validación en runtime — e isomórfico (server y client).
 * Para añadir una receta: crea el `.json` y regístralo en esta lista.
 */
const recipes: readonly Recipe[] = [
  longanizaColombiana,
  chorizoDeAjo,
  chorizoCriolloArgentino,
  chorizoParrillero,
  chorizoIberico,
  chorizoRiojano,
  chorizoCantimpalo,
  chorizoVerdeMexicano,
  chorizosPicantesJalapenoQuesoCheddar,
  chorizoVenezolano,
  chorizoSantarrosano,
  chistorra,
  salchichon,
  salchichonIberico,
  chouricoPortugues,
  linguicaPortuguesa,
  linguicaCalabresa,
  sobrasada,
  fuet,
  longanizaFilipina,
  longanizaDominicana,
  loukaniko,
  merguez,
  sujuk,
  kielbasaDePollo,
  lomoCurado,
  cecinaDeLeon,
  pancetaAhumada,
  jamonSelvaNegra,
  bresaola,
  speckAltoAdige,
  magretDePatoCurado,
  bundnerfleisch,
  biltong,
  pastrami,
  jamonAhumadoPicante,
  hamburguesaCerdoEuropea,
  mortadelaDePolloCasera,
  jamonPiernaHorneado,
  charquiDeRes,
];

export function getRecipes(): readonly Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getRecipeSummaries(): readonly RecipeSummary[] {
  return recipes.map(({ slug, name, description, image, tags }) => ({
    slug,
    name,
    description,
    image,
    tags,
  }));
}

/** Lista única y ordenada de todas las etiquetas, para el filtro de la página. */
export function getAllTags(): readonly string[] {
  return [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}
