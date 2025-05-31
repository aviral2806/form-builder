import { Field, FieldOption } from "~/stores/formBuilder";
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { Checkbox, Input } from "antd";

interface DropdownFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function DropdownFieldEditor({
  updateOption,
  getOptionValue,
}: DropdownFieldEditorProps) {
  // Get options as string and parse to array
  const optionsString = getOptionValue(
    "options",
    "Option 1\nOption 2\nOption 3"
  );
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Parse options string into array
    if (optionsString) {
      const parsedOptions = optionsString
        .split("\n")
        .map((opt: string) => opt.trim())
        .filter((opt: string) => opt.length > 0);
      setOptions(
        parsedOptions.length > 0
          ? parsedOptions
          : ["Option 1", "Option 2", "Option 3"]
      );
    } else {
      setOptions(["Option 1", "Option 2", "Option 3"]);
    }
  }, [optionsString]);

  const updateOptions = (newOptions: string[]) => {
    setOptions(newOptions);
    // Convert array back to string for storage
    const optionsString = newOptions.join("\n");
    updateOption("options", optionsString, "string");
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
        Dropdown Field Options
      </h3>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => updateSingleOption(index, e.target.value)}
                className="flex-1"
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

      {/* Allow Multiple Selections */}
      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("allowMultiple", false)}
          onChange={(e) =>
            updateOption("allowMultiple", e.target.checked, "boolean")
          }
        >
          Allow multiple selections
        </Checkbox>
      </div>

      {/* Make Dropdown Searchable */}
      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("searchable", false)}
          onChange={(e) =>
            updateOption("searchable", e.target.checked, "boolean")
          }
        >
          Make dropdown searchable
        </Checkbox>
      </div>

      {/* Default Value */}
      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <Input
          value={getOptionValue("defaultValue", "")}
          onChange={(e) => updateOption("defaultValue", e.target.value)}
          placeholder="Leave empty for no default selection"
        />
        <p className="text-xs text-gray-500 mt-1">
          For multiple selection, separate values with commas
        </p>
      </div>
    </div>
  );
}
