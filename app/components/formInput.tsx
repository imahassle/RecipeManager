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
  const defaultValue = useField(name);
  return (
    <>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        type={type ?? "text"}
        name={name}
        defaultValue={defaultValue.defaultValue}
        {...props}
      />
    </>
  );
};
