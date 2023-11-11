import { useSubmit } from "@remix-run/react";
import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton: React.FC = () => {
  const isSubmitting = useIsSubmitting();
  const submit = useSubmit();
  return (
    <button
      type="submit"
      onClick={(ev) => submit(ev.currentTarget)}
      disabled={isSubmitting}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
