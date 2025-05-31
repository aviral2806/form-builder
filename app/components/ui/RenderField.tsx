import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import TextField from "./fields/TextField";
import TextareaField from "./fields/TextareaField";
import EmailField from "./fields/EmailField";
import PhoneField from "./fields/PhoneField";
import CheckboxField from "./fields/CheckboxField";
import RadioField from "./fields/RadioField";
import DropdownField from "./fields/DropdownField";
import DateField from "./fields/DateField";
import TimeField from "./fields/TimeField";
import type { Field } from "~/stores/formBuilder";

interface RenderFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  isSortable?: boolean;
}

export default function RenderField({
  field,
  onEdit,
  onDelete,
  isSortable = false,
}: RenderFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    disabled: !isSortable,
    data: {
      type: field.type,
      field: field,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderFieldComponent = () => {
    const commonProps = {
      field,
      onEdit,
      onDelete,
      mode: "edit" as const,
    };

    switch (field.type) {
      case "text":
        return <TextField {...commonProps} />;
      case "textarea":
        return <TextareaField {...commonProps} />;
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
          <div className="p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 text-red-800 dark:text-red-200">
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  if (!isSortable) {
    return renderFieldComponent();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "z-50" : ""}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 bg-gray-100 dark:bg-gray-700 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>

      {renderFieldComponent()}
    </div>
  );
}
