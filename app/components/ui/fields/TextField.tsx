import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface TextFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function TextField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: TextFieldProps) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const minLength = getOptionValue("minLength", 0);
  const maxLength = getOptionValue("maxLength", 0);
  const pattern = getOptionValue("pattern", "");

  // Helper function to convert simple pattern to regex and generate error message
  const processPattern = (simplePattern: string) => {
    if (!simplePattern.trim()) return null;

    const trimmed = simplePattern.trim();

    // Check if it uses % wildcards
    if (trimmed.includes("%")) {
      if (trimmed.startsWith("%") && trimmed.endsWith("%")) {
        // %pattern% - must contain
        const content = trimmed.slice(1, -1);
        return {
          regex: new RegExp(content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
          errorMessage: `Must contain "${content}"`,
        };
      } else if (trimmed.endsWith("%")) {
        // pattern% - must start with
        const content = trimmed.slice(0, -1);
        return {
          regex: new RegExp(
            `^${content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
          ),
          errorMessage: `Must start with "${content}"`,
        };
      } else if (trimmed.startsWith("%")) {
        // %pattern - must end with
        const content = trimmed.slice(1);
        return {
          regex: new RegExp(
            `${content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
          ),
          errorMessage: `Must end with "${content}"`,
        };
      }
    } else {
      // Exact match
      return {
        regex: new RegExp(
          `^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
        ),
        errorMessage: `Must be exactly "${trimmed}"`,
      };
    }

    return null;
  };

  // Validation function
  const validateInput = (inputValue: string) => {
    const validationErrors: string[] = [];

    // Required validation
    if (field.required && !inputValue.trim()) {
      validationErrors.push("This field is required");
    }

    // Only validate length and pattern if field has value or is touched
    if (inputValue && touched) {
      // Min length validation
      if (minLength > 0 && inputValue.length < minLength) {
        validationErrors.push(`Must be at least ${minLength} characters`);
      }

      // Max length validation
      if (maxLength > 0 && inputValue.length > maxLength) {
        validationErrors.push(`Must be no more than ${maxLength} characters`);
      }

      // Pattern validation
      if (pattern && inputValue) {
        const patternInfo = processPattern(pattern);
        if (patternInfo) {
          try {
            if (!patternInfo.regex.test(inputValue)) {
              validationErrors.push(patternInfo.errorMessage);
            }
          } catch (e) {
            validationErrors.push("Invalid pattern configuration");
          }
        }
      }
    }

    return validationErrors;
  };

  // Update validation on value change
  useEffect(() => {
    const validationErrors = validateInput(value);
    setErrors(validationErrors);
  }, [value, field.required, minLength, maxLength, pattern, touched]);

  const handleInputChange = (newValue: string) => {
    setValue(newValue);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  // Determine input border color based on validation state
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

  // Generate pattern hint for display
  const getPatternHint = () => {
    if (!pattern) return null;

    const patternInfo = processPattern(pattern);
    if (patternInfo) {
      return patternInfo.errorMessage
        .replace("Must be", "Should be")
        .replace("Must", "Should");
    }
    return "Must match the specified format";
  };

  // Get label classes based on mode
  const getLabelClasses = () => {
    return "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  };

  // Get container classes based on mode
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
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        className={getInputClassName()}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
      />

      {/* Character count (if max length is set) */}
      {maxLength > 0 && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxLength}
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

      {/* Success message when valid */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Valid input</span>
        </div>
      )}

      {/* Validation hints (only show when not touched or no value) */}
      {(!touched || !value) && (minLength > 0 || maxLength > 0 || pattern) && (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          {minLength > 0 && maxLength > 0 && (
            <div>
              Must be between {minLength} and {maxLength} characters
            </div>
          )}
          {minLength > 0 && maxLength === 0 && (
            <div>Minimum {minLength} characters required</div>
          )}
          {maxLength > 0 && minLength === 0 && (
            <div>Maximum {maxLength} characters allowed</div>
          )}
          {pattern && <div>{getPatternHint()}</div>}
        </div>
      )}
    </div>
  );

  // If in preview mode, return just the field content without BaseField wrapper
  if (mode === "preview") {
    return fieldContent;
  }

  // If in edit mode, wrap with BaseField for edit/delete functionality
  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      {fieldContent}
    </BaseField>
  );
}
