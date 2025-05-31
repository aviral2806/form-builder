import { useFormBuilderStore } from "~/stores/formBuilder";
import type { Field } from "~/stores/formBuilder";
import TextField from "./fields/TextField";
import TextareaField from "./fields/TextareaField";
import EmailField from "./fields/EmailField";
import PhoneField from "./fields/PhoneField";
import CheckboxField from "./fields/CheckboxField";
import RadioField from "./fields/RadioField";
import DropdownField from "./fields/DropdownField";
import DateField from "./fields/DateField";
import TimeField from "./fields/TimeField";

interface FormPreviewProps {
  device: string;
}

export default function FormPreview({ device }: FormPreviewProps) {
  const { formName, sections } = useFormBuilderStore();

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
        return <TextField key={field.id} field={field} mode="preview" />;
      case "textarea":
        return <TextareaField key={field.id} field={field} mode="preview" />;
      case "email":
        return <EmailField key={field.id} field={field} mode="preview" />;
      case "phone":
        return <PhoneField key={field.id} field={field} mode="preview" />;
      case "checkbox":
        return <CheckboxField key={field.id} field={field} mode="preview" />;
      case "radio":
        return <RadioField key={field.id} field={field} mode="preview" />;
      case "dropdown":
        return <DropdownField key={field.id} field={field} mode="preview" />;
      case "date":
        return <DateField key={field.id} field={field} mode="preview" />;
      case "time":
        return <TimeField key={field.id} field={field} mode="preview" />;
      default:
        return (
          <div
            key={field.id}
            className="p-2 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 text-red-800 dark:text-red-200"
          >
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 min-h-[500px]">
      <form className="space-y-6">
        <div className="border-b border-gray-200 dark:border-zinc-700 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formName || "Untitled Form"}
          </h1>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            {/* Always show section title */}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-zinc-700 pb-2">
              {section.title || "Untitled Section"}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => renderField(field))}
            </div>
            {section.fields.length === 0 && (
              <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                No fields in this section
              </p>
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No sections added to the form yet.</p>
            <p className="text-sm mt-2">
              Add some sections and fields to see the preview.
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
