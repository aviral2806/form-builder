import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox } from "antd";

interface CheckboxFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function CheckboxFieldEditor({
  updateOption,
  getOptionValue,
}: CheckboxFieldEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Checkbox Field Options
      </h3>

      <div className="flex items-center space-x-3">
        <Checkbox
          checked={getOptionValue("defaultChecked", false)}
          onChange={(e) =>
            updateOption("defaultChecked", e.target.checked, "boolean")
          }
        >
          Checked by default
        </Checkbox>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Checkbox Text</label>
        <input
          type="text"
          value={getOptionValue("checkboxText", "I agree")}
          onChange={(e) => updateOption("checkboxText", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          placeholder="Text that appears next to checkbox"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={getOptionValue("description", "")}
          onChange={(e) => updateOption("description", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          rows={3}
          placeholder="Additional description or terms text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Link Text (optional)
        </label>
        <input
          type="text"
          value={getOptionValue("linkText", "")}
          onChange={(e) => updateOption("linkText", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          placeholder="e.g., Terms and Conditions"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Link URL (optional)
        </label>
        <input
          type="url"
          value={getOptionValue("linkUrl", "")}
          onChange={(e) => updateOption("linkUrl", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          placeholder="https://example.com/terms"
        />
      </div>
    </div>
  );
}
