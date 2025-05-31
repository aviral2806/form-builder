import { Field, FieldOption } from "~/stores/formBuilder";
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { Select, Input } from "antd";

const { Option } = Select;

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
        Radio Button Field Options
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

      {/* Options Layout */}
      <div>
        <label className="block text-sm font-medium mb-1">Layout</label>
        <Select
          value={getOptionValue("optionsLayout", "vertical")}
          onChange={(value) => updateOption("optionsLayout", value)}
          className="w-full"
        >
          <Option value="vertical">Vertical</Option>
          <Option value="horizontal">Horizontal</Option>
        </Select>
      </div>

      {/* Default Value */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Default Selection
        </label>
        <Select
          value={getOptionValue("defaultValue", "")}
          onChange={(value) => updateOption("defaultValue", value)}
          className="w-full"
          allowClear
          placeholder="No default selection"
        >
          {options.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}
