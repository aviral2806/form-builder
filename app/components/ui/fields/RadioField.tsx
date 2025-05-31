import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Radio } from "antd";
import type { Field } from "~/stores/formBuilder";

interface RadioFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
  onValidation?: (isValid: boolean, errors: string[]) => void;
  onValueChange?: (value: any) => void;
  initialValue?: string;
}

export default function RadioField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
  onValidation,
  onValueChange,
  initialValue,
}: RadioFieldProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const optionsString = getOptionValue(
    "options",
    "Option 1\nOption 2\nOption 3"
  );
  const defaultValue = getOptionValue("defaultValue", "");
  const optionsLayout = getOptionValue("optionsLayout", "vertical");

  const options = optionsString
    .split("\n")
    .map((opt: string) => opt.trim())
    .filter((opt: string) => opt.length > 0);

  useEffect(() => {
    const initialState =
      initialValue !== undefined ? initialValue : defaultValue;
    setValue(initialState || undefined);
  }, [defaultValue, initialValue]);

  const validateRadio = (selectedValue: string | undefined) => {
    const validationErrors: string[] = [];
    if (field.required && !selectedValue) {
      validationErrors.push("Please select an option");
    }
    return validationErrors;
  };

  useEffect(() => {
    const validationErrors = validateRadio(value);
    setErrors(validationErrors);

    // Call validation callback if in preview mode
    if (mode === "preview" && onValidation) {
      const isValid = validationErrors.length === 0;
      onValidation(isValid, validationErrors);
    }
  }, [value, field.required, mode, onValidation]);

  const handleChange = (e: any) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in preview mode
    if (mode === "preview" && onValueChange) {
      onValueChange(selectedValue);
    }
  };

  const getLabelClasses = () => {
    return "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  };

  const getContainerClasses = () => {
    if (mode === "preview") {
      return "space-y-2";
    }
    return "space-y-2";
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {options.length > 0 ? (
        <Radio.Group
          value={value}
          onChange={handleChange}
          className={`${
            optionsLayout === "horizontal"
              ? "flex flex-wrap gap-4"
              : "flex flex-col space-y-2"
          }`}
        >
          {options.map((option, index) => (
            <Radio
              key={index}
              value={option}
              className="text-gray-700 dark:text-gray-300"
            >
              {option}
            </Radio>
          ))}
        </Radio.Group>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 text-sm italic">
          No options configured
        </p>
      )}

      {/* Validation errors */}
      {touched && errors.length > 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Option selected</span>
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
