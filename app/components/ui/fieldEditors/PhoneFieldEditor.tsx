import { Field, FieldOption } from "~/stores/formBuilder";
import { Select, Checkbox } from "antd";

const { Option } = Select;

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
  const showCountryCode = getOptionValue("showCountryCode", true);
  const defaultCountryCode = getOptionValue("defaultCountryCode", "+1");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Phone Field Options
      </h3>

      {/* Show Country Code Toggle */}
      <div className="space-y-2">
        <Checkbox
          checked={showCountryCode}
          onChange={(e) =>
            updateOption("showCountryCode", e.target.checked, "boolean")
          }
        >
          <span className="text-sm font-medium">
            Show country code selector
          </span>
        </Checkbox>
        <p className="text-xs text-gray-500 ml-6">
          Allow users to select their country code
        </p>
      </div>

      {/* Default Country Code */}
      {showCountryCode && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Default Country Code
          </label>
          <Select
            value={defaultCountryCode}
            onChange={(value) => updateOption("defaultCountryCode", value)}
            className="w-full"
            showSearch
            placeholder="Select default country code"
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
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-gray-500">({country.name})</span>
                </span>
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* Preview */}
      {/* <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Preview
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>
            Country code selector: {showCountryCode ? "Enabled" : "Disabled"}
          </div>
          {showCountryCode && <div>Default country: {defaultCountryCode}</div>}
          <div>Validation: Exactly 10 digits required</div>
          <div>
            Input hint:{" "}
            {showCountryCode
              ? "Format based on selected country"
              : "Enter number without country code"}
          </div>
        </div>
      </div> */}
    </div>
  );
}
