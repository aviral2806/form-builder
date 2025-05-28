import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox, Tooltip } from "antd";
import { HelpCircle } from "lucide-react";

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
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
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
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          min="0"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-1">
          <label className="block text-sm font-medium">Pattern</label>
          <Tooltip
            title={
              <div className="space-y-2">
                <div className="font-medium">Pattern Examples:</div>
                <div>
                  <strong>%pattern%</strong> - Must contain "pattern"
                </div>
                <div>
                  <strong>pattern%</strong> - Must start with "pattern"
                </div>
                <div>
                  <strong>%pattern</strong> - Must end with "pattern"
                </div>
                <div>
                  <strong>abc123</strong> - Must be exactly "abc123"
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Use % as wildcard for flexible matching
                </div>
              </div>
            }
            placement="top"
            overlayStyle={{ maxWidth: "300px" }}
          >
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </div>
        <input
          type="text"
          value={getOptionValue("pattern", "")}
          onChange={(e) => updateOption("pattern", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          placeholder="e.g., %@gmail.com, USER%, %123"
        />
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <div>Use simple patterns with % as wildcard</div>
        </div>
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
