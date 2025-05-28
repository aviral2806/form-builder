import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface TimeFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function TimeField({ field, onEdit, onDelete }: TimeFieldProps) {
  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="time"
        className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        required={field.required}
      />
    </BaseField>
  );
}
