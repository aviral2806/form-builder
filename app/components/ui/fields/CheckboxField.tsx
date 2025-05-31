import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Checkbox } from "antd";
import type { Field } from "~/stores/formBuilder";

interface CheckboxFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function CheckboxField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: CheckboxFieldProps) {
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const defaultChecked = getOptionValue("defaultChecked", false);
  const checkboxText = getOptionValue("checkboxText", "I agree");
  const description = getOptionValue("description", "");
  const linkText = getOptionValue("linkText", "");
  const linkUrl = getOptionValue("linkUrl", "");

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const validateCheckbox = (isChecked: boolean) => {
    const validationErrors: string[] = [];
    if (field.required && !isChecked) {
      validationErrors.push("This field is required");
    }
    return validationErrors;
  };

  useEffect(() => {
    if (touched) {
      setErrors(validateCheckbox(checked));
    }
  }, [checked, field.required, touched]);

  const handleChange = (isChecked: boolean) => {
    setChecked(isChecked);
    if (!touched) {
      setTouched(true);
    }
  };

  const getLabelClasses = () => {
    return "text-sm font-medium text-gray-700 dark:text-gray-300";
  };

  const getContainerClasses = () => {
    if (mode === "preview") {
      return "space-y-2";
    }
    return "space-y-2";
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      {/* Field Label */}
      <div className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </div>

      {/* Checkbox with text and link */}
      <div className="flex items-start space-x-2">
        <Checkbox
          checked={checked}
          onChange={(e) => handleChange(e.target.checked)}
          required={field.required}
          className="mt-0.5"
        />
        <div className="text-gray-600 dark:text-gray-400">
          {checkboxText}
          {linkText && linkUrl && (
            <>
              {" "}
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {linkText}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
          {description}
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
      {touched && errors.length === 0 && checked && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Checkbox checked</span>
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
