import { useState } from "react";
import { Plus } from "lucide-react";
import { useFormBuilderStore } from "~/stores/formBuilder";
import DroppableSection from "./DroppableSection";
import FieldEditorModal from "./FieldEditorModal";
import type { Field } from "~/stores/formBuilder";

export default function FormCanvas() {
  const { formName, setFormName, sections, addSection, updateField } =
    useFormBuilderStore();
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

  const handleSaveField = (updatedField: Field) => {
    updateField(updatedField.id, updatedField);
    setEditingField(null);
    setIsModalOpen(false);
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
