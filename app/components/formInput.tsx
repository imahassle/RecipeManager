/* eslint-disable react/prop-types */
import { TextareaHTMLAttributes } from "react";
import { useControlField, useField } from "remix-validated-form";

export type FormInputProps = {
  name: string;
  inline?: boolean;
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput: React.FC<FormInputProps> = ({
  inline = true,
  name,
  label,
  type,
  className,
  ...props
}) => {
  const { error, defaultValue } = useField(name);

  return (
    <div
      className={`flex ${
        inline
          ? "flex-row gap-2 justify-center"
          : "flex-col justify-start gap-1"
      }`}
    >
      {label ? <label htmlFor={name}>{label}</label> : null}
      <div className="flex flex-col gap-1">
        <input
          type={type ?? "text"}
          name={name}
          defaultValue={defaultValue}
          className={`rounded border-2 border-slate-400 active:border-blue-600 ${
            error ? "border-red-600 active:border-red-600" : ""
          } ${className}`}
          {...props}
        />
        {error ? <p className="text-red-600">{error}</p> : null}
      </div>
    </div>
  );
};

export type TextAreaProps = {
  name: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  className,
  ...props
}) => {
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  return (
    <div className="flex flex-col gap-1">
      <input type="hidden" name={name} key={value} value={value} />
      <textarea
        className={`rounded border-2 border-slate-400 active:border-blue-600 ${
          error ? "border-red-600 active:border-red-600" : ""
        } ${className}`}
        defaultValue={defaultValue}
        onChange={(ev) => setValue(ev.currentTarget.value)}
        {...props}
      />
      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
};
