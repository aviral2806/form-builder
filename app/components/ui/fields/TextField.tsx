import BaseField from "../BaseField";
import type { Field } from "~/stores/formBuilder";

interface TextFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function TextField({ field, onEdit, onDelete }: TextFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const isMultiline = getOptionValue("multiline", false);
  const minLength = getOptionValue("minLength", 0);
  const maxLength = getOptionValue("maxLength", 0);
  const pattern = getOptionValue("pattern", "");

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isMultiline ? (
        <textarea
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}`
          }
          required={field.required}
          minLength={minLength > 0 ? minLength : undefined}
          maxLength={maxLength > 0 ? maxLength : undefined}
          rows={3}
        />
      ) : (
        <input
          type="text"
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}`
          }
          required={field.required}
          minLength={minLength > 0 ? minLength : undefined}
          maxLength={maxLength > 0 ? maxLength : undefined}
          pattern={pattern || undefined}
        />
      )}

      {/* Validation hints */}
      <div className="text-xs text-gray-500 mt-1 space-y-1">
        {minLength > 0 && maxLength > 0 && (
          <div>
            Must be between {minLength} and {maxLength} characters
          </div>
        )}
        {minLength > 0 && maxLength === 0 && (
          <div>Minimum {minLength} characters required</div>
        )}
        {maxLength > 0 && minLength === 0 && (
          <div>Maximum {maxLength} characters allowed</div>
        )}
        {pattern && <div>Must match pattern: {pattern}</div>}
      </div>
    </BaseField>
  );
}
