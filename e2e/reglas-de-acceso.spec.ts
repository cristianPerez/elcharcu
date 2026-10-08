import { expect, test } from '@playwright/test';

import {
  ANONYMOUS_QUESTIONS,
  canAskWithoutAccount,
  canOpenCourse,
  canOpenRecipeFromCookbook,
  canSeeFullCookbook,
  canSeeRelatedRecipes,
  safeDestination,
  viewerPlanOf,
} from '@/shared/lib/access';

/**
 * Las reglas de acceso son funciones puras (`shared/lib/access`): se prueban
 * sin navegador. Corren solo en un proyecto.
 */

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Sin navegador');
});

test('el plan sale de la sesión y del id de la base', () => {
  expect(viewerPlanOf(false, 'pro-anual')).toBe('anonimo');
  expect(viewerPlanOf(true, null)).toBe('aprendiz');
  expect(viewerPlanOf(true, 'aprendiz')).toBe('aprendiz');
  expect(viewerPlanOf(true, 'pro-mensual')).toBe('pro');
  expect(viewerPlanOf(true, 'maestro-anual')).toBe('maestro');
});

test('cursos: sin cuenta ninguno; con cuenta los libres; con Pro todos', () => {
  expect(canOpenCourse('anonimo', 'libre')).toBe(false);
  expect(canOpenCourse('aprendiz', 'libre')).toBe(true);
  expect(canOpenCourse('aprendiz', 'pago')).toBe(false);
  expect(canOpenCourse('pro', 'pago')).toBe(true);
  expect(canOpenCourse('maestro', 'pago')).toBe(true);
});

test('El Charcu sin cuenta: dos preguntas', () => {
  expect(ANONYMOUS_QUESTIONS).toBe(2);
  expect(canAskWithoutAccount('anonimo', 0)).toBe(true);
  expect(canAskWithoutAccount('anonimo', 1)).toBe(true);
  expect(canAskWithoutAccount('anonimo', 2)).toBe(false);
  expect(canAskWithoutAccount('aprendiz', 50)).toBe(true);
});

test('recetario: completo y parecidas con Pro; sin Pro, solo las recibidas', () => {
  expect(canSeeFullCookbook('anonimo')).toBe(false);
  expect(canSeeFullCookbook('aprendiz')).toBe(false);
  expect(canSeeFullCookbook('pro')).toBe(true);
  expect(canOpenRecipeFromCookbook('aprendiz', false)).toBe(false);
  expect(canOpenRecipeFromCookbook('anonimo', true)).toBe(true);
  expect(canOpenRecipeFromCookbook('maestro', false)).toBe(true);
  expect(canSeeRelatedRecipes('aprendiz')).toBe(false);
  expect(canSeeRelatedRecipes('pro')).toBe(true);
});

test('el destino del enlace solo puede ser una ruta interna', () => {
  expect(safeDestination('/cursos/sal-de-cura')).toBe('/cursos/sal-de-cura');
  expect(safeDestination('/charcu?pregunta=hola')).toBe('/charcu?pregunta=hola');
  for (const bad of [
    'https://evil.example.com',
    '//evil.example.com',
    '/\\evil.example.com',
    'javascript:alert(1)',
    '/cursos\n/x',
    `/${'a'.repeat(400)}`,
    null,
    undefined,
    '',
  ]) {
    expect(safeDestination(bad)).toBe('/cursos');
  }
});
