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
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "India" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    // Add more as needed
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
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} ({country})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Format</label>
        <select
          value={getOptionValue("format", "international")}
          onChange={(e) => updateOption("format", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
        >
          <option value="international">International (+1 234 567 8900)</option>
          <option value="national">(234) 567-8900</option>
          <option value="raw">Raw (2345678900)</option>
        </select>
      </div>
    </div>
  );
}
