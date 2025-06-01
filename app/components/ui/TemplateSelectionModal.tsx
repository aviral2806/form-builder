import { useState, useEffect } from "react";
import { Sparkles, FileText, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import TemplateCard from "./TemplateCard";
import { FormTemplateService } from "~/services/templateService";
import type { Template } from "~/types/template";
import type { FormTemplate } from "~/services/templateService";
import toast from "react-hot-toast";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  onStartFresh: () => void;
}

export default function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelectTemplate,
  onStartFresh,
}: TemplateSelectionModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [defaultTemplates, setDefaultTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch default templates from backend
  useEffect(() => {
    const fetchDefaultTemplates = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        console.log("📚 Fetching default templates from backend...");

        const templates = await FormTemplateService.getDefaultTemplates();
        console.log("✅ Fetched default templates:", templates.length);

        // Convert FormTemplate to Template format for the UI
        const convertedTemplates: Template[] = templates.map(
          (template: FormTemplate) => ({
            id: template.id,
            name: template.form_name,
            description:
              template.description || "Pre-built template to get you started",
            tags: template.tags || [],
            estimatedTime: "3-5 min", // Default estimation
            isPopular: true, // Mark all default templates as popular
            structure: {
              formName: template.form_name,
              sections: template.form_structure,
            },
          })
        );

        setDefaultTemplates(convertedTemplates);
      } catch (error) {
        console.error("❌ Error fetching default templates:", error);
        toast.error("Failed to load templates");
        setDefaultTemplates([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultTemplates();
  }, [isOpen]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      console.log("🎯 Using template:", selectedTemplate.name);
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  const handleStartFresh = () => {
    console.log("📝 Starting fresh");
    onStartFresh();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Starting Point"
      size="xl"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Get Started Quickly</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from our pre-built templates or start with a blank canvas
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleStartFresh}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Start Fresh
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build your form from scratch
                </p>
              </div>
            </div>
          </button>

          <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Use Template
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Save time with pre-built forms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Available Templates
          </h3>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading templates...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && defaultTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No templates available at the moment
              </p>
            </div>
          )}

          {/* Template Grid */}
          {!loading && defaultTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                  isSelected={selectedTemplate?.id === template.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t dark:border-gray-700 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Use Selected Template
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
