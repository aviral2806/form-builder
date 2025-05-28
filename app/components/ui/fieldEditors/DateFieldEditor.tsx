import { Field, FieldOption } from "~/stores/formBuilder";
import { Checkbox } from "antd";

interface DateFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function DateFieldEditor({
  updateOption,
  getOptionValue,
}: DateFieldEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Date Field Options
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">Min Date</label>
        <input
          type="date"
          value={getOptionValue("minDate", "")}
          onChange={(e) => updateOption("minDate", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Date</label>
        <input
          type="date"
          value={getOptionValue("maxDate", "")}
          onChange={(e) => updateOption("maxDate", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <select
          value={getOptionValue("defaultValue", "none")}
          onChange={(e) => updateOption("defaultValue", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
        >
          <option value="none">No default</option>
          <option value="today">Today</option>
          <option value="custom">Custom date</option>
        </select>
      </div>

      <div className="flex items-center">
        <Checkbox
          checked={getOptionValue("disableWeekends", false)}
          onChange={(e) =>
            updateOption("disableWeekends", e.target.checked, "boolean")
          }
        >
          Disable weekends
        </Checkbox>
      </div>
    </div>
  );
}
