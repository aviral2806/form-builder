import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormBuilderStore } from "~/stores/formBuilder";
import FieldPreview from "./FieldPreview";
import RenderField from "./RenderField";
import type { Section, Field } from "~/stores/formBuilder";
import toast from "react-hot-toast";

interface DroppableSectionProps {
  section: Section;
  index: number;
  onEditField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
}

export default function DroppableSection({
  section,
  index,
  onEditField,
  onDeleteField,
}: DroppableSectionProps) {
  const { updateSectionTitle, deleteSection } = useFormBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setTempTitle(section.title);
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    updateSectionTitle(section.id, tempTitle.trim());
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  const handleDeleteSection = () => {
    const sectionTitle = section.title || `Section ${index + 1}`;

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500">🗑️</span>
            <span className="font-medium">Delete "{sectionTitle}"?</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will also delete all {section.fields.length} field(s) in this
            section. This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteSection(section.id);
                toast.dismiss(t.id);
                toast.success(
                  `"${sectionTitle}" section deleted successfully`,
                  {
                    duration: 2000,
                  }
                );
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  // Get field IDs for SortableContext
  const fieldIds = section.fields
    ? section.fields.map((field: any) => field.id)
    : [];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 flex-1"
              placeholder="Section title (optional)"
            />
          ) : (
            <h3
              onClick={handleTitleClick}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex-1 group"
            >
              {section.title || `Section ${index + 1}`}{" "}
              <Edit2 className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-50 transition-opacity" />
            </h3>
          )}
        </div>

        <button
          onClick={handleDeleteSection}
          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {/* Existing Fields */}
        {section.fields.length > 0 && (
          <div className="space-y-2">
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              {section.fields.map((field: any) => (
                <RenderField
                  key={field.id}
                  field={field}
                  onEdit={onEditField}
                  onDelete={onDeleteField}
                  isSortable={true}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {/* Always Visible Drop Zone */}
        <div
          ref={setNodeRef}
          className={`min-h-[80px] rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 ${
            isOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg scale-[1.02]"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <div
            className={`transition-all duration-200 ${
              isOver ? "scale-110" : "scale-100"
            }`}
          >
            <Plus
              className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                isOver
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            />
          </div>

          <p
            className={`text-sm font-medium transition-colors ${
              isOver
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isOver ? "Drop field here" : "Drag fields here"}
          </p>

          <p
            className={`text-xs mt-1 transition-colors ${
              isOver
                ? "text-blue-500 dark:text-blue-300"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {section.fields.length > 0
              ? "Add more fields to this section"
              : "Start building your form by adding fields"}
          </p>
        </div>
      </div>
    </div>
  );
}
