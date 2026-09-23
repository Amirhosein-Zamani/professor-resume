// types/form-schema.ts

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "url"
  | "tel"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "datetime"
  | "file"
  | "image"
  | "avatar"
  | "cv"
  | "password"
  | "hidden";

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldValidation = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  isEmail?: boolean;
  isUrl?: boolean;
  isBase64Image?: boolean;
  isBoolean?: boolean;
};

export type FormFieldDto = {
  key: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: FormFieldOption[];
  dependsOn?: {
    field: string;
    value: unknown;
  };
  order?: number;
  section?: string;
  accept?: string;
  rows?: number;
  multiple?: boolean;
  validation?: FormFieldValidation;
};

export type FormSchemaResponse = {
  id: string;
  target: "PROFESSOR" | "ACTIVITY";
  title: string;
  schema: FormFieldDto[];
  createdAt: string;
  updatedAt: string;
};

// Values are driven by schemas received from the API and are narrowed by each
// consumer before being sent to a typed endpoint payload.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValues = Record<string, any>;
