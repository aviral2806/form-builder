import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface TimeFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function TimeField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: TimeFieldProps) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const validateTime = (time: string) => {
    const validationErrors: string[] = [];

    if (field.required && !time) {
      validationErrors.push("This field is required");
    }

    return validationErrors;
  };

  useEffect(() => {
    if (touched) {
      setErrors(validateTime(value));
    }
  }, [value, field.required, touched]);

  const handleTimeChange = (newValue: string) => {
    setValue(newValue);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputClassName = () => {
    let baseClass =
      "w-full border rounded px-2 py-1 text-sm transition-colors duration-200";

    if (touched && errors.length > 0) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400`;
    } else if (touched && errors.length === 0 && value) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400`;
    } else {
      return `${baseClass} border-gray-300 bg-gray-50 dark:bg-zinc-800 dark:border-gray-600`;
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

      <input
        type="time"
        value={value}
        onChange={(e) => handleTimeChange(e.target.value)}
        onBlur={handleBlur}
        className={getInputClassName()}
        required={field.required}
      />

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
          <span>Valid time selected</span>
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
