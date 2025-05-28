import BaseField from "../BaseField";
import { Checkbox } from "antd";
import type { Field } from "~/stores/formBuilder";

interface CheckboxFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function CheckboxField({
  field,
  onEdit,
  onDelete,
}: CheckboxFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const defaultChecked = getOptionValue("defaultChecked", false);
  const checkboxText = getOptionValue("checkboxText", "I agree");
  const description = getOptionValue("description", "");
  const linkText = getOptionValue("linkText", "");
  const linkUrl = getOptionValue("linkUrl", "");

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <div className="space-y-2">
        {/* Field Label */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </div>

        {/* Checkbox with text and link */}
        <div className="flex items-start space-x-2">
          <Checkbox
            defaultChecked={defaultChecked}
            required={field.required}
            className="mt-0.5"
          />
          <div className="text-gray-600 dark:text-gray-400">
            {checkboxText}
            {linkText && linkUrl && (
              <>
                {" "}
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {linkText}
                </a>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
            {description}
          </div>
        )}
      </div>
    </BaseField>
  );
}
