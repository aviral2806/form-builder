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
        <div className="flex items-start space-x-2">
          <Checkbox
            defaultChecked={defaultChecked}
            required={field.required}
            className="mt-0.5"
          >
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
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
          </Checkbox>
        </div>

        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
            {description}
          </div>
        )}
      </div>
    </BaseField>
  );
}
