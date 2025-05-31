import { nanoid } from "nanoid";
import { CSS } from "@dnd-kit/utilities";
import { FieldPreview } from "./FieldPalette";
import { useDraggable } from "@dnd-kit/core";

export default function DraggableField({
  type,
  label,
}: {
  type: string;
  label: string;
}) {
  const fieldId = `palette-${type}-${nanoid()}`;

  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: fieldId,
      data: {
        type,
        label,
        isPaletteItem: true, // This should be properly set
      },
    });

  // Debug log to verify data is set
  console.log(`DraggableField ${type}:`, {
    fieldId,
    data: { type, label, isPaletteItem: true },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 border rounded p-2 cursor-grab hover:bg-gray-200 dark:hover:bg-zinc-700"
      style={style}
      role="button"
      tabIndex={0}
    >
      <div className="w-32">
        <FieldPreview type={type} />
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {label}
      </span>
    </div>
  );
}
