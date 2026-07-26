import chistorra from '../recipes/chistorra.json';
import chorizoCantimpalo from '../recipes/chorizo-cantimpalo.json';
import chorizoCriolloArgentino from '../recipes/chorizo-criollo-argentino.json';
import chorizoDeAjo from '../recipes/chorizo-de-ajo.json';
import chorizoIberico from '../recipes/chorizo-iberico.json';
import chorizoParrillero from '../recipes/chorizo-parrillero.json';
import chorizoRiojano from '../recipes/chorizo-riojano.json';
import chorizoVenezolano from '../recipes/chorizo-venezolano.json';
import chorizoVerdeMexicano from '../recipes/chorizo-verde-mexicano.json';
import chouricoPortugues from '../recipes/chourico-portugues.json';
import fuet from '../recipes/fuet.json';
import linguicaCalabresa from '../recipes/linguica-calabresa.json';
import linguicaPortuguesa from '../recipes/linguica-portuguesa.json';
import longanizaColombiana from '../recipes/longaniza-colombiana.json';
import longanizaDominicana from '../recipes/longaniza-dominicana.json';
import longanizaFilipina from '../recipes/longaniza-filipina.json';
import loukaniko from '../recipes/loukaniko.json';
import merguez from '../recipes/merguez.json';
import salchichonIberico from '../recipes/salchichon-iberico.json';
import salchichon from '../recipes/salchichon.json';
import sobrasada from '../recipes/sobrasada.json';
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
  chorizoVenezolano,
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
