import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface DateFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function DateField({ field, onEdit, onDelete }: DateFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const minDate = getOptionValue("minDate", "");
  const maxDate = getOptionValue("maxDate", "");
  const defaultValue = getOptionValue("defaultValue", "none");
  const disableWeekends = getOptionValue("disableWeekends", false);

  const getDefaultDate = () => {
    if (defaultValue === "today") {
      return new Date().toISOString().split("T")[0];
    }
    return "";
  };

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        required={field.required}
        min={minDate || undefined}
        max={maxDate || undefined}
        defaultValue={getDefaultDate()}
      />

      {/* Date constraints info */}
      <div className="text-xs text-gray-500 mt-1 space-y-1">
        {minDate && <div>Minimum date: {minDate}</div>}
        {maxDate && <div>Maximum date: {maxDate}</div>}
        {disableWeekends && <div>Weekends disabled</div>}
        {defaultValue === "today" && <div>Defaults to today's date</div>}
      </div>
    </BaseField>
  );
}
