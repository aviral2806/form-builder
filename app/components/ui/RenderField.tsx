import type { Field } from "~/stores/formBuilder";
import TextField from "./fields/TextField";
import TextAreaField from "./fields/TextAreaField";
import EmailField from "./fields/EmailField";
import PhoneField from "./fields/PhoneField";
import CheckboxField from "./fields/CheckboxField";
import RadioField from "./fields/RadioField";
import DropdownField from "./fields/DropdownField";
import DateField from "./fields/DateField";
import TimeField from "./fields/TimeField";

interface RenderFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function RenderField({
  field,
  onEdit,
  onDelete,
}: RenderFieldProps) {
  const commonProps = { field, onEdit, onDelete };

  switch (field.type) {
    case "text":
      return <TextField {...commonProps} />;
    case "textarea":
      return <TextAreaField {...commonProps} />;
    case "email":
      return <EmailField {...commonProps} />;
    case "phone":
      return <PhoneField {...commonProps} />;
    case "checkbox":
      return <CheckboxField {...commonProps} />;
    case "radio":
      return <RadioField {...commonProps} />;
    case "dropdown":
      return <DropdownField {...commonProps} />;
    case "date":
      return <DateField {...commonProps} />;
    case "time":
      return <TimeField {...commonProps} />;
    default:
      return (
        <div className="p-2 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 text-red-800 dark:text-red-200">
          Unknown field type: {field.type}
        </div>
      );
  }
}
