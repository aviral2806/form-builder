import { create } from "zustand";
import { nanoid } from "nanoid";

export interface Field {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ key: string; value: any }>;
}

export interface Section {
  id: string;
  title: string;
  fields: Field[];
}

interface FormBuilderState {
  formName: string;
  sections: Section[];
  editingField: Field | null;
  currentTemplateId: string | null; // Track if we're editing an existing template

  // Actions
  setFormName: (name: string) => void;
  addSection: () => void;
  addFieldToSection: (sectionId: string, fieldData: Partial<Field>) => void;
  setEditingField: (field: Field | null) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  reorderFields: (sectionId: string, oldIndex: number, newIndex: number) => void;
  resetForm: () => void;
  loadTemplate: (template: { formName: string; sections: Section[]; templateId?: string }) => void;
  setCurrentTemplateId: (id: string | null) => void;
  updateSection: (sectionId: string, updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formName: "",
  sections: [
    {
      id: nanoid(),
      title: "Section 1",
      fields: [],
    },
  ],
  editingField: null,
  currentTemplateId: null,

  setFormName: (name) => set({ formName: name }),

  addSection: () =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id: nanoid(),
          title: `Section ${state.sections.length + 1}`,
          fields: [],
        },
      ],
    })),

  addFieldToSection: (sectionId, fieldData) => {
    const newField: Field = {
      id: nanoid(),
      type: fieldData.type || "text",
      label: fieldData.label || "Untitled Field",
      required: false,
      placeholder: "",
      options: [],
    };

    set((state) => {
      const updatedSections = state.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section
      );
      return { sections: updatedSections };
    });
  },

  setEditingField: (field) => set({ editingField: field }),

  updateField: (fieldId, updates) =>
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      })),
    })),

  deleteField: (fieldId) => {
    console.log("🗑️ Deleting field:", fieldId);
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        fields: section.fields.filter((field) => {
          const shouldKeep = field.id !== fieldId;
          if (!shouldKeep) {
            console.log("✅ Removed field from section:", section.id);
          }
          return shouldKeep;
        }),
      })),
      // Also clear editingField if we're deleting the field being edited
      editingField: state.editingField?.id === fieldId ? null : state.editingField,
    }));
  },

  updateSectionTitle: (sectionId, title) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    })),

  // Reorder fields within a section
  reorderFields: (sectionId, oldIndex, newIndex) =>
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id === sectionId) {
          const newFields = [...section.fields];
          const [removed] = newFields.splice(oldIndex, 1);
          newFields.splice(newIndex, 0, removed);
          return { ...section, fields: newFields };
        }
        return section;
      }),
    })),

  // Load template data into the store
  loadTemplate: (template) =>
    set(() => ({
      formName: template.formName,
      sections: template.sections,
      currentTemplateId: template.templateId || null,
      editingField: null,
    })),

  // Set current template ID
  setCurrentTemplateId: (id) => set({ currentTemplateId: id }),

  // Reset form to initial state
  resetForm: () =>
    set(() => ({
      formName: "",
      sections: [
        {
          id: nanoid(),
          title: "Section 1",
          fields: [],
        },
      ],
      editingField: null,
      currentTemplateId: null,
    })),

  updateSection: (sectionId, updates) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    })),

  deleteSection: (sectionId: string) => {
    console.log("🗑️ Deleting section:", sectionId);
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== sectionId),
    }));
  },
}));

export type FieldType = 
  | "text" 
  | "textarea" 
  | "email" 
  | "phone" 
  | "checkbox" 
  | "radio" 
  | "dropdown" 
  | "date";
  // Removed "time"
