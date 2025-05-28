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
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const showCountryCode = getOptionValue("showCountryCode", true);
  const defaultCountryCode = getOptionValue("defaultCountryCode", "+1");
  const format = getOptionValue("format", "international");

  const getPlaceholder = () => {
    switch (format) {
      case "international":
        return `${defaultCountryCode} 234 567 8900`;
      case "national":
        return "(234) 567-8900";
      case "raw":
        return "2345678900";
      default:
        return "Phone number";
    }
  };

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex space-x-2">
        {showCountryCode && (
          <select className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800 w-20">
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+91">+91</option>
            <option value="+49">+49</option>
            <option value="+33">+33</option>
          </select>
        )}
        <input
          type="tel"
          className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder={field.placeholder || getPlaceholder()}
          required={field.required}
        />
      </div>

      {/* Format hint */}
      <div className="text-xs text-gray-500 mt-1">
        Format: {format} {showCountryCode && "(with country code)"}
      </div>
    </BaseField>
  );
}
