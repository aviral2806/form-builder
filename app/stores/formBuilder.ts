import { create } from "zustand";
import { nanoid } from "nanoid";

export interface FieldOption {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'array';
}

export interface Field {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options: FieldOption[]; // Make sure this is always an array
}

// When creating new fields, ensure options is initialized
const createNewField = (type: string, label: string): Field => ({
  id: nanoid(),
  type,
  label,
  required: false,
  placeholder: '',
  options: [], // Initialize empty array
});

export interface Section {
  id: string;
  fields: Field[];
}

interface FormBuilderState {
  formName: string;
  sections: Section[];
  editingField: Field | null;
  setFormName: (name: string) => void;
  addSection: () => void;
  addFieldToSection: (sectionId: string, field: Field) => void;
  setEditingField: (field: Field | null) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formName: "Untitled Form",
  sections: [{ id: nanoid(), fields: [] }],
  editingField: null,

  setFormName: (name) => set({ formName: name }),

  addSection: () =>
    set((state) => ({
      sections: [...state.sections, { id: nanoid(), fields: [] }],
    })),

  addFieldToSection: (sectionId, fieldData) => {
    const newField: Field = {
      id: nanoid(),
      type: fieldData.type,
      label: fieldData.label,
      required: false,
      placeholder: '',
      options: [], // Always initialize options array
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
      sections: state.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }))
    })),
}));
