import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox } from "antd";

interface PhoneFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function PhoneFieldEditor({
  updateOption,
  getOptionValue,
}: PhoneFieldEditorProps) {
  const countryCodes = [
    { code: "+1", country: "US/Canada", digits: 10 },
    { code: "+44", country: "UK", digits: 10 },
    { code: "+91", country: "India", digits: 10 },
    { code: "+49", country: "Germany", digits: 11 },
    { code: "+33", country: "France", digits: 10 },
    { code: "+61", country: "Australia", digits: 9 },
    { code: "+81", country: "Japan", digits: 10 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Phone Field Options
      </h3>

      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("showCountryCode", true)}
          onChange={(e) =>
            updateOption("showCountryCode", e.target.checked, "boolean")
          }
        >
          Show country code selector
        </Checkbox>
      </div>

      {getOptionValue("showCountryCode", true) && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Default Country Code
          </label>
          <select
            value={getOptionValue("defaultCountryCode", "+1")}
            onChange={(e) => updateOption("defaultCountryCode", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          >
            {countryCodes.map(({ code, country, digits }) => (
              <option key={code} value={code}>
                {code} ({country}) - {digits} digits
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Phone format will be determined by the selected country code
          </p>
        </div>
      )}

      {!getOptionValue("showCountryCode", true) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Without country code, phone numbers will be validated as 10-digit
            numbers only.
          </p>
        </div>
      )}
    </div>
  );
}
