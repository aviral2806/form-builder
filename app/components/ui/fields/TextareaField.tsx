import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface TextAreaFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function TextAreaField({
  field,
  onEdit,
  onDelete,
}: TextAreaFieldProps) {
  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
      </label>
      <textarea
        className="w-full border rounded px-2 py-1 text-sm resize-none bg-gray-50 dark:bg-zinc-800"
        rows={3}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    </BaseField>
  );
}
