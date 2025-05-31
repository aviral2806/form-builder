import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface PhoneFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function PhoneField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: PhoneFieldProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const showCountryCode = getOptionValue("showCountryCode", true);
  const defaultCountry = getOptionValue("defaultCountry", "US");

  const countryCodes = [
    { code: "+1", country: "US", digits: 10 },
    { code: "+44", country: "UK", digits: 10 },
    { code: "+91", country: "IN", digits: 10 },
    { code: "+49", country: "DE", digits: 11 },
    { code: "+33", country: "FR", digits: 10 },
  ];

  const getCurrentCountry = () => {
    if (showCountryCode && selectedCountryCode) {
      return (
        countryCodes.find((c) => c.code === selectedCountryCode) ||
        countryCodes[0]
      );
    }
    return (
      countryCodes.find((c) => c.country === defaultCountry) || countryCodes[0]
    );
  };

  const validatePhone = (phone: string) => {
    const validationErrors: string[] = [];
    const currentCountry = getCurrentCountry();

    if (field.required && !phone.trim()) {
      validationErrors.push("This field is required");
    }

    if (phone && touched) {
      if (!/^\d+$/.test(phone)) {
        validationErrors.push("Phone number must contain only digits");
      }

      if (phone.length !== currentCountry.digits) {
        validationErrors.push(
          `Phone number must be exactly ${currentCountry.digits} digits`
        );
      }
    }

    if (showCountryCode && field.required && !selectedCountryCode && touched) {
      validationErrors.push("Country code is required");
    }

    return validationErrors;
  };

  useEffect(() => {
    setErrors(validatePhone(phoneNumber));
  }, [phoneNumber, selectedCountryCode, field.required, touched]);

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    setPhoneNumber(digitsOnly);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setSelectedCountryCode(code);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputClassName = (hasErrors: boolean) => {
    let baseClass =
      "flex-1 border rounded px-2 py-1 text-sm transition-colors duration-200";

    if (touched && hasErrors) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400`;
    } else if (touched && !hasErrors && phoneNumber) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400`;
    } else {
      return `${baseClass} border-gray-300 bg-gray-50 dark:bg-zinc-800 dark:border-gray-600`;
    }
  };

  const getSelectClassName = () => {
    let baseClass =
      "border rounded px-2 py-1 text-sm transition-colors duration-200 w-24";

    if (touched && showCountryCode && !selectedCountryCode) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400`;
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

  const currentCountry = getCurrentCountry();

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex space-x-2">
        {showCountryCode && (
          <select
            value={selectedCountryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            onBlur={handleBlur}
            className={getSelectClassName()}
            required={field.required}
          >
            <option value="">Code</option>
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        )}

        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={handleBlur}
          className={getInputClassName(errors.length > 0)}
          placeholder={field.placeholder || `${currentCountry.digits} digits`}
          maxLength={currentCountry.digits}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      {/* Format hint - only show when country code is disabled */}
      {!showCountryCode && (
        <div className="text-xs text-gray-500 mt-1">
          Format: {currentCountry.digits} digits only, no country code required
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
      {touched && errors.length === 0 && phoneNumber && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Valid phone number</span>
        </div>
      )}

      {/* Validation hints */}
      {!touched && (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <div>Enter {currentCountry.digits} digits only</div>
          {showCountryCode && <div>Country code selection required</div>}
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
