import { useState, useEffect } from "react";
import { Checkbox } from "antd";
import Modal from "./Modal";
import { Field, FieldOption } from "~/stores/formBuilder";
import TextFieldEditor from "./fieldEditors/TextFieldEditor";
import EmailFieldEditor from "./fieldEditors/EmailFieldEditor";
import PhoneFieldEditor from "./fieldEditors/PhoneFieldEditor";
import DateFieldEditor from "./fieldEditors/DateFieldEditor";
import CheckboxFieldEditor from "./fieldEditors/CheckboxFieldEditor";
import RadioFieldEditor from "./fieldEditors/RadioFieldEditor";
import DropdownFieldEditor from "./fieldEditors/DropdownFieldEditor";

interface FieldEditorModalProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Field) => void;
}

export default function FieldEditorModal({
  field,
  isOpen,
  onClose,
  onSave,
}: FieldEditorModalProps) {
  const [editedField, setEditedField] = useState<Field | null>(null);

  useEffect(() => {
    if (field) {
      // Ensure options array exists
      const fieldWithOptions = {
        ...field,
        options: field.options || [],
      };
      setEditedField(fieldWithOptions);
      console.log("Setting edited field:", fieldWithOptions); // Debug log
    }
  }, [field]);

  const handleSave = () => {
    if (editedField) {
      console.log("Saving field with options:", editedField.options); // Debug log
      onSave(editedField);
      onClose();
    }
  };

  const updateField = (updates: Partial<Field>) => {
    if (editedField) {
      const updated = { ...editedField, ...updates };
      console.log("Updating field:", updated); // Debug log
      setEditedField(updated);
    }
  };

  const updateFieldOption = (
    key: string,
    value: any,
    type: FieldOption["type"] = "string"
  ) => {
    if (!editedField) return;

    // Ensure options array exists
    const currentOptions = editedField.options || [];

    // Remove existing option with same key
    const filteredOptions = currentOptions.filter((opt) => opt.key !== key);

    // Add new option
    const newOptions = [...filteredOptions, { key, value, type }];

    console.log(
      `Updating option ${key}:`,
      value,
      "New options array:",
      newOptions
    ); // Debug log

    updateField({ options: newOptions });
  };

  const getOptionValue = (key: string, defaultValue: any = "") => {
    const options = editedField?.options || [];
    const foundOption = options.find((opt) => opt.key === key);
    const result = foundOption?.value ?? defaultValue;

    console.log(`Getting option ${key}:`, result, "from options:", options); // Debug log

    return result;
  };

  if (!editedField) return null;

  const renderFieldEditor = () => {
    const commonProps = {
      field: editedField,
      updateField,
      updateOption: updateFieldOption,
      getOptionValue,
    };

    switch (editedField.type) {
      case "text":
      case "textarea":
        return <TextFieldEditor {...commonProps} />;
      case "email":
        return <EmailFieldEditor {...commonProps} />;
      case "phone":
        return <PhoneFieldEditor {...commonProps} />;
      case "date":
      case "time":
        return <DateFieldEditor {...commonProps} />;
      case "checkbox":
        return <CheckboxFieldEditor {...commonProps} />;
      case "radio":
        return <RadioFieldEditor {...commonProps} />;
      case "dropdown":
        return <DropdownFieldEditor {...commonProps} />;
      default:
        return <div>No editor available for this field type</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${editedField.type} Field`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Debug info - remove this after testing */}
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          Debug: Options count: {editedField.options?.length || 0}
          {editedField.options?.length > 0 && (
            <div>Options: {JSON.stringify(editedField.options, null, 2)}</div>
          )}
        </div>

        {/* Common field properties */}
        <div>
          <label className="block text-sm font-medium mb-1">Field Label</label>
          <input
            type="text"
            value={editedField.label}
            onChange={(e) => updateField({ label: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Placeholder</label>
          <input
            type="text"
            value={editedField.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            checked={editedField.required || false}
            onChange={(e) => updateField({ required: e.target.checked })}
          >
            Required field
          </Checkbox>
        </div>

        {/* Field-specific options */}
        {renderFieldEditor()}

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
