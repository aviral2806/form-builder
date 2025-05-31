import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const { setNodeRef, isOver, active } = useDroppable({
    id: section.id,
  });

  // Create a separate droppable for the bottom drop zone
  const { setNodeRef: setBottomDropRef, isOver: isBottomOver } = useDroppable({
    id: `${section.id}-bottom`,
    data: {
      sectionId: section.id, // Pass the actual section ID for the drop handler
      isBottomDropZone: true,
    },
  });

  const { updateSectionTitle } = useFormBuilderStore();

  const handleSectionTitleChange = (newTitle: string) => {
    updateSectionTitle(section.id, newTitle);
  };

  // Get field IDs for SortableContext
  const fieldIds = section.fields
    ? section.fields.map((field: any) => field.id)
    : [];

  // Debug logs
  console.log(`DroppableSection ${section.id}:`, {
    isOver,
    isBottomOver,
    active: active?.id,
    fieldIds,
    hasFields: section.fields?.length > 0,
  });

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow">
      <input
        type="text"
        className="text-lg font-bold bg-transparent border-b w-1/3 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 mb-4 dark:text-gray-100 transition-colors duration-200"
        value={section.title || `Section ${index + 1}`}
        onChange={(e) => handleSectionTitleChange(e.target.value)}
        placeholder="Enter section title"
      />

      {/* Main droppable area */}
      <div
        ref={setNodeRef}
        className={`min-h-[100px] border-2 border-dashed p-4 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 ${
          isOver ? "bg-blue-100 dark:bg-blue-900/20 border-blue-400" : ""
        }`}
      >
        {section.fields && section.fields.length > 0 ? (
          <>
            {/* Sortable fields */}
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 mb-4">
                {section.fields.map((field: any) => (
                  <RenderField
                    key={field.id}
                    field={field}
                    onEdit={onEditField}
                    onDelete={onDeleteField}
                    isSortable={true}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Bottom drop zone for adding new fields */}
            <div
              ref={setBottomDropRef}
              className={`min-h-[60px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md transition-all duration-200 flex items-center justify-center ${
                isBottomOver
                  ? "bg-blue-50 dark:bg-blue-900/10 border-blue-400 scale-105"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-700/50"
              }`}
            >
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center flex items-center gap-2">
                <span>+</span>
                <span>Drop new fields here</span>
                {isBottomOver && (
                  <span className="text-blue-500 font-medium">
                    (Ready to drop!)
                  </span>
                )}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-center flex items-center justify-center h-[100px]">
            Drop fields here to get started
            {isOver && (
              <span className="ml-2 text-blue-500 font-medium">
                (Drop zone active!)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
