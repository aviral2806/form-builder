import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox } from "antd";

interface EmailFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function EmailFieldEditor({
  updateOption,
  getOptionValue,
}: EmailFieldEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Email Field Options
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">
          Custom Validation Message
        </label>
        <input
          type="text"
          value={getOptionValue("validationMessage", "")}
          onChange={(e) => updateOption("validationMessage", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder="Please enter a valid email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Allowed Domains
        </label>
        <input
          type="text"
          value={getOptionValue("allowedDomains", "")}
          onChange={(e) => updateOption("allowedDomains", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder="e.g., company.com, example.org (comma separated)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to allow all domains
        </p>
      </div>

      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("confirmEmail", false)}
          onChange={(e) =>
            updateOption("confirmEmail", e.target.checked, "boolean")
          }
        >
          Require email confirmation field
        </Checkbox>
      </div>
    </div>
  );
}
