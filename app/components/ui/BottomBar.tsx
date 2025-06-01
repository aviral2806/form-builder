import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewModal from "./PreviewModal";
import SaveTemplateModal from "./SaveTemplateModal";
import { useFormBuilderStore } from "~/stores/formBuilder";
import { FormTemplateService } from "~/services/templateService";
import toast from "react-hot-toast";

interface BottomBarProps {
  isModalOpen?: boolean;
  isEditMode?: boolean;
}

export default function BottomBar({
  isModalOpen = false,
  isEditMode = false,
}: BottomBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);

  const { sections, resetForm, currentTemplateId } = useFormBuilderStore();

  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const handleSaveTemplateClick = () => {
    console.log("🖱️ Save Template button clicked");
    console.log("📊 Current sections:", sections);

    // Validate form has content
    if (
      sections.length === 0 ||
      sections.every((section) => section.fields.length === 0)
    ) {
      console.log("❌ Validation failed: No sections or fields");
      toast.error(
        "Please add some sections and fields before saving as template"
      );
      return;
    }

    console.log("✅ Validation passed, opening modal");
    setIsSaveTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (templateData: {
    form_name: string;
    description?: string;
    tags?: string[];
    expiry_date?: string;
  }) => {
    console.log("💾 handleSaveTemplate called with:", templateData);

    try {
      let savedTemplate;

      if (isEditMode && currentTemplateId) {
        console.log("🔄 Updating existing template:", currentTemplateId);
        // Update existing template
        savedTemplate = await FormTemplateService.updateTemplate(
          currentTemplateId,
          templateData,
          sections
        );
        toast.success(
          `Template "${savedTemplate.form_name}" updated successfully!`,
          {
            duration: 4000,
            icon: "✅",
          }
        );
      } else {
        console.log("➕ Creating new template");
        // Create new template
        savedTemplate = await FormTemplateService.saveTemplate(
          templateData,
          sections
        );
        toast.success(
          `Template "${savedTemplate.form_name}" saved successfully!`,
          {
            duration: 4000,
            icon: "✅",
          }
        );
        // Reset form canvas after successful save (only for new templates)
        resetForm();
      }
    } catch (error) {
      console.error("❌ Error in handleSaveTemplate:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save template"
      );
      throw error; // Re-throw to keep modal open
    }
  };

  // Hide the bottom bar when a modal is open
  if (isModalOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 shadow-lg transition-transform duration-300 z-40 ${
          collapsed ? "translate-y-6" : "translate-y-0"
        } ${isModalOpen ? "z-30" : "z-40"}`}
        style={{ height: collapsed ? "50px" : "60px" }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-800 border rounded-full p-1 shadow"
          aria-label={collapsed ? "Expand bottom bar" : "Collapse bottom bar"}
        >
          {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {!collapsed && (
          <div className="flex justify-center items-center h-full gap-4">
            <button
              onClick={handlePreviewClick}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handleSaveTemplateClick}
              className={`text-white px-4 py-1 rounded transition-colors ${
                isEditMode
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isEditMode ? "Update Template" : "Save as Template"}
            </button>
          </div>
        )}
      </div>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
      />

      <SaveTemplateModal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        isEditMode={isEditMode}
        templateId={currentTemplateId || undefined}
      />
    </>
  );
}
