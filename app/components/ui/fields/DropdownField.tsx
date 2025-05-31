import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Select } from "antd";
import type { Field } from "~/stores/formBuilder";

const { Option } = Select;

interface DropdownFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
  onValidation?: (isValid: boolean, errors: string[]) => void;
  onValueChange?: (value: any) => void;
  initialValue?: string | string[];
}

export default function DropdownField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
  onValidation,
  onValueChange,
  initialValue,
}: DropdownFieldProps) {
  const [value, setValue] = useState<string | string[] | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const optionsString = getOptionValue(
    "options",
    "Option 1\nOption 2\nOption 3"
  );
  const allowMultiple = getOptionValue("allowMultiple", false);
  const searchable = getOptionValue("searchable", false);
  const defaultValue = getOptionValue("defaultValue", "");

  const options = optionsString
    .split("\n")
    .map((opt: string) => opt.trim())
    .filter((opt: string) => opt.length > 0);

  useEffect(() => {
    let initialState = initialValue !== undefined ? initialValue : defaultValue;

    // Handle multiple selection
    if (allowMultiple && typeof initialState === "string" && initialState) {
      initialState = initialState.split(",").map((s) => s.trim());
    }

    setValue(initialState || undefined);
  }, [defaultValue, allowMultiple, initialValue]);

  const validateDropdown = (selectedValue: string | string[] | undefined) => {
    const validationErrors: string[] = [];

    if (field.required) {
      if (!selectedValue) {
        validationErrors.push("Please select an option");
      } else if (Array.isArray(selectedValue) && selectedValue.length === 0) {
        validationErrors.push("Please select at least one option");
      } else if (typeof selectedValue === "string" && !selectedValue.trim()) {
        validationErrors.push("Please select an option");
      }
    }

    return validationErrors;
  };

  useEffect(() => {
    const validationErrors = validateDropdown(value);
    setErrors(validationErrors);

    // Call validation callback if in preview mode
    if (mode === "preview" && onValidation) {
      const isValid = validationErrors.length === 0;
      onValidation(isValid, validationErrors);
    }
  }, [value, field.required, mode, onValidation]);

  const handleChange = (selectedValue: string | string[]) => {
    setValue(selectedValue);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in preview mode
    if (mode === "preview" && onValueChange) {
      onValueChange(selectedValue);
    }
  };

  const handleClear = () => {
    setValue(undefined);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in preview mode
    if (mode === "preview" && onValueChange) {
      onValueChange(allowMultiple ? [] : "");
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

      {options.length > 0 ? (
        <Select
          value={value}
          onChange={handleChange}
          onClear={handleClear}
          placeholder={field.placeholder || "Select an option"}
          className="w-full"
          mode={allowMultiple ? "multiple" : undefined}
          showSearch={searchable}
          allowClear
          notFoundContent="No options available"
          filterOption={
            searchable
              ? (input, option) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase()) ?? false
              : false
          }
          status={touched && errors.length > 0 ? "error" : undefined}
        >
          {options.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      ) : (
        <div className="text-gray-400 dark:text-gray-500 text-sm italic p-2 border border-gray-300 dark:border-gray-600 rounded">
          No options configured
        </div>
      )}

      {/* Multiple selection hint */}
      {allowMultiple && options.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          You can select multiple options
        </div>
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
          <span>
            {Array.isArray(value)
              ? `${value.length} option${value.length > 1 ? "s" : ""} selected`
              : "Option selected"}
          </span>
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
