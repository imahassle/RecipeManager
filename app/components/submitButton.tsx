import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton: React.FC = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
