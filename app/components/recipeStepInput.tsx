import { Step } from "@prisma/client";
import { useFieldArray } from "remix-validated-form";

import { FormInput } from "./formInput";

export const RecipeStepInput: React.FC = () => {
  const [steps, { push: addStep, remove: removeStep }] =
    useFieldArray<Step>("steps");
  return (
    <div>
      <div className="flex flex-auto gap-2">
        <ol className="flex flex-col gap-2">
          {steps.map(({ defaultValue, key }, index) => (
            <li key={key} className="flex flex-row gap-3 items-center">
              <input
                type="hidden"
                name={`recipe.steps[${index}].index`}
                value={index}
              />
              <input
                type="hidden"
                name={`recipe.steps[${index}].id`}
                value={defaultValue.id}
              />
              <FormInput
                type="text"
                label={`Step ${index + 1}`}
                name={`recipe.steps[${index}].text`}
              />
              <button
                className="rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600 focus:bg-red-400"
                onClick={() => {
                  removeStep(index);
                }}
              >
                X
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-auto gap-2">
        <button
          type="button"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-40"
          onClick={() => {
            addStep({});
          }}
        >
          Add step
        </button>
      </div>
    </div>
  );
};
