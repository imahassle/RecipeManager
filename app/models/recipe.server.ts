import type { Recipe, Step, Ingredient, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Recipe, Step, Ingredient } from "@prisma/client";

interface UserId {
  userId: User["id"];
}

export function getRecipe({ id, userId }: Pick<Recipe, "id"> & UserId) {
  return prisma.recipe.findFirst({
    select: {
      id: true,
      title: true,
      source: true,
      tags: true,
      steps: true,
      ingredients: true,
    },
    where: { id, userId },
  });
}

export function getRecipeListItems({ userId }: UserId) {
  return prisma.recipe.findMany({
    select: { title: true, tags: true, id: true },
    where: { userId },
  });
}

export function createRecipe({ userId }: UserId) {
  return prisma.recipe.create({
    data: {
      User: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteRecipe({ id, userId }: Pick<Recipe, "id"> & UserId) {
  return prisma.recipe.deleteMany({
    where: { id, userId },
  });
}

export type RecipeUpdate = Pick<Recipe, "id" | "title" | "source"> & {
  steps?: Step[];
} & {
  ingredients?: Ingredient[];
} & UserId;

export function updateRecipe({
  id,
  title,
  source,
  steps,
  ingredients,
  userId,
}: RecipeUpdate) {
  return prisma.recipe.update({
    where: { id_userId: { id, userId } },
    data: {
      title,
      source,
      steps: {
        upsert: steps?.map((step) => {
          return {
            create: step,
            update: step,
            where: { id: id, step: { id: step.id, recipeId: step.recipeId } },
          };
        }),
      },
      ingredients: {
        upsert: ingredients?.map((ingredient) => {
          return {
            create: ingredient,
            update: ingredient,
            where: {
              id: id,
              ingredient: { id: ingredient.id, recipeId: ingredient.recipeId },
            },
          };
        }),
      },
    },
  });
}
