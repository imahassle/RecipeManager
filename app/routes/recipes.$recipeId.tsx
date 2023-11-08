import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getRecipe, updateRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";
import { getRecipeFromForm } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.recipeId, "recipeId not found");

  const recipe = await getRecipe({ id: params.recipeId, userId });
  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ recipe });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.recipeId, "recipeId not found");

  const formData = await request.formData();
  const recipe = getRecipeFromForm(formData);

  if (typeof recipe.title !== "string" || recipe.title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof recipe.source !== "string") {
    return json({ errors: { source: "Invalid source type" } }, { status: 400 });
  }

  console.log(`Updating recipe: ${params.recipeId}`);

  await updateRecipe({
    ...recipe,
    id: params.recipeId,
    userId,
  });

  console.log(`Recipe id: ${params.recipeId}`);

  return redirect(`/recipes/${params.recipeId}`);
};

export default function RecipeDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const isEdit = params.get("edit") === "true";

  return (
    <div>
      {!isEdit ? (
        // Display the recipe
        <>
          <h3 className="text-2xl font-bold">{data.recipe.title}</h3>
          <p className="py-6">{data.recipe.source}</p>
          <p>
            Tags:{" "}
            {data.recipe.tags?.map((tag) => {
              return <p key={tag.name}>{tag.displayName}</p>;
            })}
          </p>
          <p>Ingredients</p>
          <ul>
            {data.recipe.ingredients
              ?.sort((i) => i.index)
              .map((ingredient) => {
                return (
                  <li key={ingredient.id}>
                    {ingredient.amount} {ingredient.item}
                  </li>
                );
              })}
          </ul>
          <p>Steps</p>
          <ol>
            {data.recipe.steps
              ?.sort((s) => s.index)
              .map((step) => {
                return <li key={step.id}>{step.text}</li>;
              })}
          </ol>
        </>
      ) : (
        <>
          {/* Recipe edit form */}
          <Form method="post">
            <div className="flex flex-col gap-3">
              <div className="flex flex-auto gap-2">
                <label htmlFor="title">Recipe title</label>
                <input
                  className="border-blue-500 border-2"
                  name="title"
                  type="text"
                  defaultValue={data.recipe.title ?? ""}
                />
              </div>
              <div className="flex flex-auto gap-2">
                <label htmlFor="source">Recipe source</label>
                <input
                  className="border-blue-500 border-2"
                  name="source"
                  type="text"
                  defaultValue={data.recipe.source ?? ""}
                />
              </div>
              <div className="flex flex-row-reverse">
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Save changes
                </button>
              </div>
            </div>
            {/* <input name="tags" type="text" defaultValue={data.recipe.tags} multiple/> */}
          </Form>
        </>
      )}

      <hr className="my-4" />
      <div className="flex flex-auto flex-row-reverse gap-2">
        {!isEdit ? (
          <Link
            to="?edit=true"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Edit
          </Link>
        ) : (
          <div className="flex flex-auto flex-row-reverse gap-2">
            <Link
              to="."
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Close edit
            </Link>
            <Form action="delete" method="post">
              <button
                type="submit"
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400 focus:bg-red-600"
              >
                Delete
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
