import { useState } from "react";
import { Plus } from "lucide-react";
import { useFormBuilderStore } from "~/stores/formBuilder";
import DroppableSection from "./DroppableSection";
import FieldEditorModal from "./FieldEditorModal";
import type { Field } from "~/stores/formBuilder";
import toast from "react-hot-toast";

export default function FormCanvas() {
  const {
    formName,
    setFormName,
    sections,
    addSection,
    updateField,
    deleteField,
  } = useFormBuilderStore();
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditField = (fieldId: string) => {
    // Find the field across all sections
    let foundField: Field | null = null;
    console.log("Searching for field with ID:", fieldId); // Debug log
    sections.forEach((section) => {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) foundField = field;
    });

    console.log("Found field:", foundField); // Debug log

    if (foundField) {
      setEditingField(foundField);
      setIsModalOpen(true);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    // Find the field to get its label for confirmation
    let foundField: Field | null = null;
    sections.forEach((section) => {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) foundField = field;
    });

    if (foundField) {
      const fieldLabel = foundField.label || "Untitled Field";

      // Show toast confirmation instead of alert
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-red-500">🗑️</span>
              <span className="font-medium">Delete "{fieldLabel}"?</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("🗑️ User confirmed deletion of field:", fieldId);
                  deleteField(fieldId);
                  toast.dismiss(t.id);
                  toast.success(`"${fieldLabel}" deleted successfully`, {
                    duration: 2000,
                  });

                  // If we're deleting the field currently being edited, close the editor
                  if (editingField?.id === fieldId) {
                    setEditingField(null);
                    setIsModalOpen(false);
                  }
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity, // Keep toast open until user action
          position: "top-center",
        }
      );
    }
  };

  const handleSaveField = (updatedField: Field) => {
    updateField(updatedField.id, updatedField);
    setEditingField(null);
    setIsModalOpen(false);
    toast.success("Field updated successfully", {
      duration: 2000,
    });
  };

  const handleCloseModal = () => {
    setEditingField(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="flex-1 p-6 space-y-4 pt-24 overflow-y-auto">
        <input
          type="text"
          className="text-2xl font-bold bg-transparent border-b outline-none w-full text-gray-900 dark:text-gray-100"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter form title"
        />

        {sections.map((section, index) => (
          <DroppableSection
            key={section.id}
            section={section}
            index={index}
            onEditField={handleEditField}
            onDeleteField={handleDeleteField}
          />
        ))}

        {/* Updated Add Section Button */}
        <button
          onClick={addSection}
          className="mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-600 dark:border-blue-400 rounded-full bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </main>

      <FieldEditorModal
        field={editingField}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveField}
      />
    </>
  );
}
