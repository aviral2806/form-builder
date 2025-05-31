import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Select } from "antd";
import type { Field } from "~/stores/formBuilder";

interface DropdownFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function DropdownField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: DropdownFieldProps) {
  const [value, setValue] = useState<string | string[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const options = getOptionValue("options", [
    "Option 1",
    "Option 2",
    "Option 3",
  ]);
  const defaultSelection = getOptionValue("defaultSelection", "");
  const placeholderText = getOptionValue("placeholderText", "Select an option");
  const allowMultiple = getOptionValue("allowMultiple", false);
  const searchable = getOptionValue("searchable", false);

  useEffect(() => {
    setValue(defaultSelection || (allowMultiple ? [] : null));
  }, [defaultSelection, allowMultiple]);

  const validateDropdown = (value: string | string[] | null) => {
    const validationErrors: string[] = [];
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      validationErrors.push("This field is required");
    }
    return validationErrors;
  };

  useEffect(() => {
    if (touched) {
      setErrors(validateDropdown(value));
    }
  }, [value, field.required, touched]);

  const handleChange = (value: string | string[]) => {
    setValue(value);
    if (!touched) {
      setTouched(true);
    }
  };

  const getLabelClasses = () => {
    return "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  };

  const getContainerClasses = () => {
    if (mode === "preview") {
      return "space-y-1";
    }
    return "";
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Select
        mode={allowMultiple ? "multiple" : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholderText}
        options={options.map((option: string) => ({
          value: option,
          label: option,
        }))}
        showSearch={searchable}
        className={`w-full ${
          touched && errors.length > 0
            ? "border-red-500"
            : touched && errors.length === 0
            ? "border-green-500"
            : "border-gray-300"
        }`}
      />

      {/* Validation Errors */}
      {touched && errors.length > 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
          Valid selection
        </div>
      )}
    </div>
  );

  if (mode === "preview") {
    return fieldContent;
  }

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      {fieldContent}
    </BaseField>
  );
}
