import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewModal from "./PreviewModal";
import SaveTemplateModal from "./SaveTemplateModal";
import { useFormBuilderStore } from "~/stores/formBuilder";
import { FormTemplateService } from "~/services/templateService";
import toast from "react-hot-toast";

interface BottomBarProps {
  isModalOpen?: boolean;
}

export default function BottomBar({ isModalOpen = false }: BottomBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);

  const { sections } = useFormBuilderStore();

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
      const savedTemplate = await FormTemplateService.saveTemplate(
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
          collapsed ? "translate-y-10" : "translate-y-0"
        } ${isModalOpen ? "z-30" : "z-40"}`}
        style={{ height: collapsed ? "40px" : "60px" }}
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
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-colors"
            >
              Save as Template
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
      />
    </>
  );
}
