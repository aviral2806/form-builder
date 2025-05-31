import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { Select } from "antd";
import type { Field } from "~/stores/formBuilder";

const { Option } = Select;

// Common country codes
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
];

interface PhoneFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
  onValidation?: (isValid: boolean, errors: string[]) => void;
  onValueChange?: (value: any) => void;
  initialValue?: { countryCode: string; phoneNumber: string } | string;
}

export default function PhoneField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
  onValidation,
  onValueChange,
  initialValue,
}: PhoneFieldProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const showCountryCode = getOptionValue("showCountryCode", true); // Default to true
  const defaultCountryCode = getOptionValue("defaultCountryCode", "+1");

  useEffect(() => {
    // Initialize with default country code
    setCountryCode(defaultCountryCode);

    // Handle initial value
    if (initialValue) {
      if (typeof initialValue === "string") {
        // Parse string format "+1 1234567890" or "1234567890"
        const match = initialValue.match(/^(\+\d+)?\s*(.*)$/);
        if (match) {
          const [, code, number] = match;
          if (code) {
            setCountryCode(code);
            setPhoneNumber(number.trim());
          } else {
            setPhoneNumber(initialValue);
          }
        }
      } else if (typeof initialValue === "object") {
        setCountryCode(initialValue.countryCode || defaultCountryCode);
        setPhoneNumber(initialValue.phoneNumber || "");
      }
    }
  }, [initialValue, defaultCountryCode]);

  const validatePhone = (code: string, number: string) => {
    const validationErrors: string[] = [];

    if (field.required && !number.trim()) {
      validationErrors.push("Phone number is required");
    }

    if (number.trim()) {
      // Remove all non-digit characters for validation
      const digitsOnly = number.replace(/\D/g, "");

      // Always validate for exactly 10 digits
      if (digitsOnly.length !== 10) {
        validationErrors.push("Please enter exactly 10 digits");
      }

      // Check for common invalid patterns
      if (digitsOnly.length === 10) {
        // All same digits
        if (/^(.)\1+$/.test(digitsOnly)) {
          validationErrors.push("Please enter a valid phone number");
        }
        // Sequential digits
        if (digitsOnly === "1234567890" || digitsOnly === "0123456789") {
          validationErrors.push("Please enter a valid phone number");
        }
      }
    }

    return validationErrors;
  };

  const formatPhoneNumber = (input: string, code: string) => {
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, "");

    if (showCountryCode && code === "+1") {
      // Format as US phone number: (XXX) XXX-XXXX
      if (digitsOnly.length <= 3) {
        return digitsOnly;
      } else if (digitsOnly.length <= 6) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
      } else if (digitsOnly.length <= 10) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
          3,
          6
        )}-${digitsOnly.slice(6)}`;
      } else {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
          3,
          6
        )}-${digitsOnly.slice(6, 10)}`;
      }
    } else if (showCountryCode) {
      // For other international numbers with country code, group digits with spaces
      if (digitsOnly.length <= 4) {
        return digitsOnly;
      } else if (digitsOnly.length <= 7) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
      } else if (digitsOnly.length <= 10) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
          3,
          6
        )} ${digitsOnly.slice(6)}`;
      } else {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
          3,
          6
        )} ${digitsOnly.slice(6, 10)} ${digitsOnly.slice(10)}`;
      }
    } else {
      // Without country code, minimal formatting - just return digits with spaces
      if (digitsOnly.length <= 3) {
        return digitsOnly;
      } else if (digitsOnly.length <= 6) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
      } else if (digitsOnly.length <= 9) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
          3,
          6
        )} ${digitsOnly.slice(6)}`;
      } else {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
          3,
          6
        )} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9)}`;
      }
    }
  };

  useEffect(() => {
    const validationErrors = validatePhone(countryCode, phoneNumber);
    setErrors(validationErrors);

    // Call validation callback if in preview mode
    if (mode === "preview" && onValidation) {
      const isValid = validationErrors.length === 0;
      onValidation(isValid, validationErrors);
    }
  }, [
    countryCode,
    phoneNumber,
    field.required,
    showCountryCode,
    mode,
    onValidation,
  ]);

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in preview mode
    if (mode === "preview" && onValueChange) {
      onValueChange({
        countryCode: newCountryCode,
        phoneNumber: phoneNumber,
        fullNumber: `${newCountryCode} ${phoneNumber}`.trim(),
      });
    }
  };

  const handlePhoneNumberChange = (newValue: string) => {
    const formatted = formatPhoneNumber(newValue, countryCode);
    setPhoneNumber(formatted);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in preview mode
    if (mode === "preview" && onValueChange) {
      const valueToSend = showCountryCode
        ? {
            countryCode: countryCode,
            phoneNumber: formatted,
            fullNumber: `${countryCode} ${formatted}`.trim(),
          }
        : formatted; // Just send the phone number string if no country code

      onValueChange(valueToSend);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getInputClassName = () => {
    let baseClass =
      "border rounded px-2 py-1 text-sm transition-colors duration-200";

    if (touched && errors.length > 0) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400`;
    } else if (touched && errors.length === 0 && phoneNumber) {
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

  const getPlaceholder = () => {
    if (showCountryCode) {
      if (countryCode === "+1") {
        return "(123) 456-7890";
      }
      return "Enter phone number";
    } else {
      return "Enter number without country code";
    }
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        {/* Country Code Selector */}
        {showCountryCode && (
          <Select
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="w-32"
            showSearch
            placeholder="Code"
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              option?.value?.toString().includes(input)
            }
          >
            {countryCodes.map((country) => (
              <Option
                key={`${country.code}-${country.country}`}
                value={country.code}
              >
                <span className="flex items-center gap-1">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </span>
              </Option>
            ))}
          </Select>
        )}

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          onBlur={handleBlur}
          className={`${getInputClassName()} ${
            showCountryCode ? "flex-1" : "w-full"
          }`}
          placeholder={field.placeholder || getPlaceholder()}
        />
      </div>

      {/* Format hint */}
      <div className="text-xs text-gray-500 mt-1">
        {showCountryCode ? (
          <>
            {countryCode === "+1"
              ? "Format: (XXX) XXX-XXXX"
              : "International format"}
            {countryCode && phoneNumber && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                Full: {countryCode} {phoneNumber}
              </span>
            )}
          </>
        ) : (
          "Enter number without country code"
        )}
      </div>

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
