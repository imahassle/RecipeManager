import { Form } from "@remix-run/react";

export default function RecipesIndexPage() {
  return (
    <p>
      No recipe selected. Select a recipe on the left, or{" "}
      <Form action="new" method="post">
        <button type="submit" className="text-blue-500 underline">
          create a new recipe.
        </button>
      </Form>
    </p>
  );
}
