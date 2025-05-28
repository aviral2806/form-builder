import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface PhoneFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function PhoneField({
  field,
  onEdit,
  onDelete,
}: PhoneFieldProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const showCountryCode = getOptionValue("showCountryCode", true);
  const defaultCountryCode = getOptionValue("defaultCountryCode", "+1");

  const countryCodes = [
    { code: "+1", country: "US/Canada", digits: 10 },
    { code: "+44", country: "UK", digits: 10 },
    { code: "+91", country: "India", digits: 10 },
    { code: "+49", country: "Germany", digits: 11 },
    { code: "+33", country: "France", digits: 10 },
    { code: "+61", country: "Australia", digits: 9 },
    { code: "+81", country: "Japan", digits: 10 },
  ];

  // Initialize selected country code
  useEffect(() => {
    if (showCountryCode && !selectedCountryCode) {
      setSelectedCountryCode(defaultCountryCode);
    }
  }, [showCountryCode, defaultCountryCode, selectedCountryCode]);

  // Get current country info
  const getCurrentCountry = () => {
    if (!showCountryCode) {
      return { digits: 10, country: "Default" };
    }
    return (
      countryCodes.find((c) => c.code === selectedCountryCode) ||
      countryCodes[0]
    );
  };

  // Validation function
  const validatePhone = (phone: string, countryCode: string) => {
    const validationErrors: string[] = [];

    // Required validation
    if (field.required && !phone.trim()) {
      validationErrors.push("Phone number is required");
      return validationErrors;
    }

    // Country code validation (if enabled)
    if (showCountryCode && field.required && !countryCode) {
      validationErrors.push("Please select a country code");
    }

    if (phone) {
      // Only allow digits
      if (!/^\d+$/.test(phone)) {
        validationErrors.push("Phone number must contain only digits");
        return validationErrors;
      }

      // Length validation based on country
      const currentCountry = getCurrentCountry();
      if (phone.length !== currentCountry.digits) {
        validationErrors.push(
          `Phone number must be exactly ${currentCountry.digits} digits`
        );
      }
    }

    return validationErrors;
  };

  // Update validation on changes
  useEffect(() => {
    if (touched) {
      const validationErrors = validatePhone(phoneNumber, selectedCountryCode);
      setErrors(validationErrors);
    }
  }, [
    phoneNumber,
    selectedCountryCode,
    field.required,
    showCountryCode,
    touched,
  ]);

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const numericValue = value.replace(/\D/g, "");
    setPhoneNumber(numericValue);

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

  // Get input className based on validation state
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

  const currentCountry = getCurrentCountry();

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

      {/* Character count */}
      {phoneNumber && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {phoneNumber.length}/{currentCountry.digits}
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
      {touched &&
        errors.length === 0 &&
        phoneNumber &&
        (showCountryCode ? selectedCountryCode : true) && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span>Valid phone number</span>
          </div>
        )}

      {/* Validation hints (only show when not touched) */}
      {!touched && (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <div>Enter {currentCountry.digits} digits only</div>
          {showCountryCode && <div>Country code selection required</div>}
        </div>
      )}
    </BaseField>
  );
}
