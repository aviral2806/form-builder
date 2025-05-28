import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface EmailFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function EmailField({
  field,
  onEdit,
  onDelete,
}: EmailFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const confirmEmail = getOptionValue("confirmEmail", false);
  const allowedDomains = getOptionValue("allowedDomains", "");
  const validationMessage = getOptionValue("validationMessage", "");

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="email"
        className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        placeholder={field.placeholder || "Email"}
        required={field.required}
        title={validationMessage || undefined}
      />

      {confirmEmail && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="email"
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
            placeholder={`Confirm ${field.placeholder || "email"}`}
            required={field.required}
          />
        </div>
      )}

      {/* Validation hints */}
      <div className="text-xs text-gray-500 mt-1 space-y-1">
        {allowedDomains && (
          <div>Only emails from: {allowedDomains} are allowed</div>
        )}
        {confirmEmail && <div>Email confirmation required</div>}
      </div>
    </BaseField>
  );
}
