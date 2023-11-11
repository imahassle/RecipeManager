/* eslint-disable react/prop-types */
import { useField } from "remix-validated-form";

export type FormInputProps = {
  name: string;
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  ...props
}) => {
  const { error, defaultValue } = useField(name);

  return (
    <>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <div className="flex flex-col gap-1">
        <input
          type={type ?? "text"}
          name={name}
          defaultValue={defaultValue}
          className={`rounded border-2 border-blue-400 active:border-blue-600 ${
            error ? "border-red-600 active:border-red-600" : ""
          } ${props.className}`}
          {...props}
        />
        {error ? <p className="text-red-600">{error}</p> : null}
      </div>
    </>
  );
};
