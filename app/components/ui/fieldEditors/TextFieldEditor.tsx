import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox } from "antd";

interface TextFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function TextFieldEditor({
  updateOption,
  getOptionValue,
}: TextFieldEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Text Field Options
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">Min Length</label>
        <input
          type="number"
          value={getOptionValue("minLength", "")}
          onChange={(e) =>
            updateOption("minLength", parseInt(e.target.value) || 0, "number")
          }
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Length</label>
        <input
          type="number"
          value={getOptionValue("maxLength", "")}
          onChange={(e) =>
            updateOption("maxLength", parseInt(e.target.value) || 0, "number")
          }
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Pattern (Regex)
        </label>
        <input
          type="text"
          value={getOptionValue("pattern", "")}
          onChange={(e) => updateOption("pattern", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder="e.g., ^[A-Za-z]+$"
        />
        <p className="text-xs text-gray-500 mt-1">
          Regular expression pattern for validation
        </p>
      </div>

      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("multiline", false)}
          onChange={(e) =>
            updateOption("multiline", e.target.checked, "boolean")
          }
        >
          Multi-line text (textarea)
        </Checkbox>
      </div>
    </div>
  );
}
