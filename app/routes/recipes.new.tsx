import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { createRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  // invariant(params.recipeId, "recipeId not found");

  // const formData = await request.formData();
  // const title = formData.get("title");

  // if (typeof recipe.title !== "string" || recipe.title.length === 0) {
  //     return json(
  //       { errors: { title: "Title is required" } },
  //       { status: 400 },
  //     );
  //   }

  const recipe = await createRecipe({ userId });
  return redirect(`/recipes/${recipe.id}?edit=true`);
};

// export default function NewRecipe() {

// }
