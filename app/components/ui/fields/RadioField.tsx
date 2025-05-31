import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Radio } from "antd";
import type { Field } from "~/stores/formBuilder";

interface RadioFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function RadioField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: RadioFieldProps) {
  const [value, setValue] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const options = getOptionValue("options", ["Option 1", "Option 2"]);
  const defaultSelection = getOptionValue("defaultSelection", "");
  const layout = getOptionValue("layout", "vertical");

  useEffect(() => {
    setValue(defaultSelection);
  }, [defaultSelection]);

  const validateRadio = (value: string) => {
    const validationErrors: string[] = [];
    if (field.required && !value) {
      validationErrors.push("This field is required");
    }
    return validationErrors;
  };

  useEffect(() => {
    if (touched) {
      setErrors(validateRadio(value));
    }
  }, [value, field.required, touched]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    if (!touched) {
      setTouched(true);
    }
  };

  const getRadioOptions = () => {
    return options.map((option: string) => ({
      label: option,
      value: option,
    }));
  };

  const getDirection = () => {
    switch (layout) {
      case "horizontal":
        return "horizontal";
      case "grid":
        return "horizontal"; // Ant Design doesn't have grid, use horizontal
      default:
        return "vertical";
    }
  };

  const getStyle = () => {
    if (layout === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "8px",
      };
    }
    return {};
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
      <div className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </div>

      <Radio.Group
        name={`radio-${field.id}`}
        value={value}
        onChange={handleChange}
        options={getRadioOptions()}
        optionType="default"
        buttonStyle="outline"
        style={getStyle()}
        className={layout === "horizontal" ? "flex flex-wrap gap-4" : ""}
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
          <span>Valid selection</span>
        </div>
      )}

      {/* Layout info (only in edit mode) */}
      {mode === "edit" && (
        <div className="text-xs text-gray-500 mt-1">
          Layout: {layout} • {options.length} options
          {defaultSelection && ` • Default: ${defaultSelection}`}
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
