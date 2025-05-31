import { useDroppable } from "@dnd-kit/core";
import RenderField from "./RenderField";
import { useFormBuilderStore } from "~/stores/formBuilder";

interface DroppableSectionProps {
  section: any;
  index: number;
  onEditField?: (fieldId: string) => void;
  onDeleteField?: (fieldId: string) => void;
}

export default function DroppableSection({
  section,
  index,
  onEditField,
  onDeleteField,
}: DroppableSectionProps) {
  const { setNodeRef } = useDroppable({
    id: section.id,
  });

  const { updateSectionTitle } = useFormBuilderStore();

  const handleSectionTitleChange = (newTitle: string) => {
    updateSectionTitle(section.id, newTitle);
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow">
      <input
        type="text"
        className="text-lg font-bold bg-transparent border-b w-1/3 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 mb-4 dark:text-gray-100 transition-colors duration-200"
        value={section.title || `Section ${index + 1}`}
        onChange={(e) => handleSectionTitleChange(e.target.value)}
        placeholder="Enter section title"
      />
      <div
        ref={setNodeRef}
        className="min-h-[100px] border-2 border-dashed p-4 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
      >
        {section.fields && section.fields.length > 0 ? (
          <div>
            {section.fields.map((field) => (
              <RenderField
                key={field.id}
                field={field}
                onEdit={onEditField}
                onDelete={onDeleteField}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-center flex items-center justify-center h-[100px]">
            Drop fields here
          </p>
        )}
      </div>
    </div>
  );
}
