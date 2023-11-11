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
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";

import { FormInput } from "~/components/formInput";
import { RecipeStepInput } from "~/components/recipeStepInput";
import { SubmitButton } from "~/components/submitButton";
import { Step, getRecipe, updateRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";
import { getObject } from "~/utils";

const recipeUpdateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).nullable(),
  source: z.string().nullable(),
  steps: z.array(
    z
      .object({
        text: z.string().nullable(),
        index: z.coerce.number(),
      })
      .nullable(),
  ),
});

const validator = withZod(recipeUpdateSchema);

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.recipeId, "recipeId not found");

  const recipe = await getRecipe({ id: params.recipeId, userId });
  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ recipe });
};

export async function action({ params, request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  invariant(params.recipeId, "recipeId not found");

  const recipe = await getObject(request, recipeUpdateSchema);

  if (typeof recipe.title !== "string" || recipe.title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof recipe.source !== "string") {
    return json({ errors: { source: "Invalid source type" } }, { status: 400 });
  }

  await updateRecipe({
    title: recipe.title,
    steps: recipe.steps as Step[],
    ingredients: [],
    id: params.recipeId,
    source: recipe.source,
    userId,
  });

  return redirect(`/recipes/${params.recipeId}`);
}

export default function RecipeDetailsPage() {
  const { recipe } = useLoaderData<typeof loader>();
  // const data = useActionData<typeof action>();

  const [params] = useSearchParams();
  const isEdit = params.get("edit") === "true";

  return (
    <div className="mx-12 my-6 flex flex-col gap-4">
      {!isEdit ? (
        // Display the recipe
        <>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-2 pb-0">{recipe.title}</h1>
            {recipe.source ? (
              <div className="py-2 italic">{recipe.source}</div>
            ) : (
              <div>-</div>
            )}
          </div>
          {recipe.tags ? (
            <div className="flex flex-row gap-2">
              {recipe.tags.map((tag) => {
                return (
                  <div className="rounded p-1 bg-slate-400 " key={tag.name}>
                    {tag.displayName}
                  </div>
                );
              })}
            </div>
          ) : null}
          <div>
            <h3 className="text-2xl">Ingredients</h3>
          </div>
          {recipe.ingredients
            ?.sort((i) => i.index)
            .map((ingredient) => {
              return (
                <div key={ingredient.index}>
                  {ingredient.amount} {ingredient.item}
                </div>
              );
            })}
          <div>
            {recipe.steps
              .sort((s) => s.index)
              .map((step, index) => {
                return (
                  <div className="flex flex-row gap-2" key={step.index}>
                    <div>{index + 1}.</div>
                    <div>{step.text}</div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <>
          {/* Recipe edit form */}
          <ValidatedForm
            method="post"
            validator={validator}
            noValidate={true}
            defaultValues={recipe}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-auto gap-2">
                <FormInput
                  label="Title"
                  className="border-blue-500 border-2"
                  name="title"
                  type="text"
                />
              </div>
              <div className="flex flex-auto gap-2">
                <FormInput
                  label="Source"
                  className="border-blue-500 border-2"
                  name="source"
                  type="text"
                />
              </div>
              <RecipeStepInput />
              <div className="flex flex-row-reverse">
                <SubmitButton />
              </div>
            </div>
            {/* <input name="tags" type="text" defaultValue={data.recipe.tags} multiple/> */}
          </ValidatedForm>
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
