import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface DropdownFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function DropdownField({
  field,
  onEdit,
  onDelete,
}: DropdownFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const options = getOptionValue("options", [
    "Option 1",
    "Option 2",
    "Option 3",
  ]);
  const defaultSelection = getOptionValue("defaultSelection", "");
  const placeholderText = getOptionValue("placeholderText", "Select an option");
  const allowMultiple = getOptionValue("allowMultiple", false);
  const searchable = getOptionValue("searchable", false);
  const maxSelections = getOptionValue("maxSelections", null);

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        required={field.required}
        multiple={allowMultiple}
        defaultValue={defaultSelection}
      >
        {!allowMultiple && (
          <option value="" disabled>
            {placeholderText}
          </option>
        )}
        {options.map((option: string, index: number) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Option info */}
      <div className="text-xs text-gray-500 mt-1 space-y-1">
        <div>{options.length} options available</div>
        {allowMultiple && (
          <div>
            Multiple selections allowed
            {maxSelections && ` (max: ${maxSelections})`}
          </div>
        )}
        {searchable && <div>Searchable dropdown</div>}
        {defaultSelection && <div>Default: {defaultSelection}</div>}
      </div>
    </BaseField>
  );
}
