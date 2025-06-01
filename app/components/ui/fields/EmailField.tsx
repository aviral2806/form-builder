import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface EmailFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview" | "submission";
  onValidation?: (isValid: boolean, errors: string[]) => void;
  onValueChange?: (value: any) => void;
  initialValue?: any;
}

export default function EmailField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
  onValidation,
  onValueChange,
  initialValue,
}: EmailFieldProps) {
  const [value, setValue] = useState(initialValue?.email || "");
  const [confirmValue, setConfirmValue] = useState(
    initialValue?.confirmEmail || ""
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmErrors, setConfirmErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const allowedDomains = getOptionValue("allowedDomains", "");
  const confirmEmail = getOptionValue("confirmEmail", false);

  // Validation function
  const validateEmail = (email: string) => {
    const validationErrors: string[] = [];

    // Required validation
    if (field.required && !email.trim()) {
      validationErrors.push("This field is required");
    }

    if (email) {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        validationErrors.push("Please enter a valid email address");
      }

      // Domain validation
      if (allowedDomains && email) {
        const domains = allowedDomains.split(",").map((d: string) => d.trim());
        const emailDomain = email.split("@")[1];
        if (emailDomain && !domains.includes(emailDomain)) {
          validationErrors.push(`Email must be from: ${domains.join(", ")}`);
        }
      }
    }

    return validationErrors;
  };

  const validateConfirmEmail = (confirmEmail: string) => {
    const validationErrors: string[] = [];
    if (confirmEmail && confirmEmail !== value) {
      validationErrors.push("Emails do not match");
    }
    return validationErrors;
  };

  // Check if we're in interactive mode (preview or submission)
  const isInteractiveMode = mode === "preview" || mode === "submission";

  useEffect(() => {
    const emailErrors = validateEmail(value);
    const confirmEmailErrors = confirmEmail
      ? validateConfirmEmail(confirmValue)
      : [];

    setErrors(emailErrors);
    setConfirmErrors(confirmEmailErrors);

    // Call validation callback if in interactive mode
    if (isInteractiveMode && onValidation) {
      const allErrors = [...emailErrors, ...confirmEmailErrors];
      const isValid = allErrors.length === 0;
      onValidation(isValid, allErrors);
    }
  }, [
    value,
    confirmValue,
    field.required,
    allowedDomains,
    confirmEmail,
    isInteractiveMode,
    // Removed: mode, onValidation
  ]);

  // Sync with initial value - only when initialValue changes and is different
  useEffect(() => {
    if (initialValue && typeof initialValue === "object") {
      const newEmail = initialValue.email || "";
      const newConfirmEmail = initialValue.confirmEmail || "";

      // Only update if values are actually different
      if (newEmail !== value) {
        setValue(newEmail);
      }
      if (newConfirmEmail !== confirmValue) {
        setConfirmValue(newConfirmEmail);
      }
    } else if (typeof initialValue === "string" && initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]); // Removed value and confirmValue dependencies

  const handleEmailChange = (newValue: string) => {
    setValue(newValue);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in interactive mode
    if (isInteractiveMode && onValueChange) {
      if (confirmEmail) {
        onValueChange({
          email: newValue,
          confirmEmail: confirmValue,
        });
      } else {
        onValueChange(newValue);
      }
    }
  };

  const handleConfirmEmailChange = (newValue: string) => {
    setConfirmValue(newValue);
    if (!confirmTouched) {
      setConfirmTouched(true);
    }

    // Call value change callback if in interactive mode
    if (isInteractiveMode && onValueChange) {
      onValueChange({
        email: value,
        confirmEmail: newValue,
      });
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
  };

  const handleConfirmEmailBlur = () => {
    setConfirmTouched(true);
  };

  const getInputClassName = (
    hasErrors: boolean,
    isTouched: boolean,
    inputValue: string
  ) => {
    let baseClass =
      "w-full border rounded px-2 py-1 text-sm transition-colors duration-200";

    if (isTouched && hasErrors) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400`;
    } else if (isTouched && !hasErrors && inputValue) {
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
        type="email"
        value={value}
        onChange={(e) => handleEmailChange(e.target.value)}
        onBlur={handleEmailBlur}
        className={getInputClassName(errors.length > 0, touched, value)}
        placeholder={field.placeholder || "Email"}
      />

      {/* Email validation errors */}
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

      {/* Email success message */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Valid email address</span>
        </div>
      )}

      {/* Confirm Email Field */}
      {confirmEmail && (
        <div className="mt-3">
          <label className={getLabelClasses()}>
            Confirm Email
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <input
            type="email"
            value={confirmValue}
            onChange={(e) => handleConfirmEmailChange(e.target.value)}
            onBlur={handleConfirmEmailBlur}
            className={getInputClassName(
              confirmErrors.length > 0,
              confirmTouched,
              confirmValue
            )}
            placeholder="Confirm your email"
          />

          {/* Confirm email validation errors */}
          {confirmTouched && confirmErrors.length > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
              {confirmErrors.map((error, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="text-red-500">•</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm email success message */}
          {confirmTouched && confirmErrors.length === 0 && confirmValue && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
              <span className="text-green-500">✓</span>
              <span>Emails match</span>
            </div>
          )}
        </div>
      )}

      {/* Validation hints */}
      {(!touched || !value) && (allowedDomains || confirmEmail) && (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          {allowedDomains && (
            <div>Allowed domains: {allowedDomains.replace(/,/g, ", ")}</div>
          )}
          {confirmEmail && <div>Email confirmation required</div>}
        </div>
      )}
    </div>
  );

  if (isInteractiveMode) {
    return fieldContent;
  }

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      {fieldContent}
    </BaseField>
  );
}
