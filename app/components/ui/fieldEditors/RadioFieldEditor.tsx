import { Field, FieldOption } from "~/stores/formBuilder";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface RadioFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function RadioFieldEditor({
  updateOption,
  getOptionValue,
}: RadioFieldEditorProps) {
  const [options, setOptions] = useState<string[]>(
    getOptionValue("options", ["Option 1", "Option 2"])
  );

  const updateOptions = (newOptions: string[]) => {
    setOptions(newOptions);
    updateOption("options", newOptions, "array");
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    updateOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      updateOptions(newOptions);
    }
  };

  const updateSingleOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Radio Button Field Options
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateSingleOption(index, e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Remove option"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addOption}
          className="mt-2 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Option</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Default Selection
        </label>
        <select
          value={getOptionValue("defaultSelection", "")}
          onChange={(e) => updateOption("defaultSelection", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
        >
          <option value="">No default selection</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
