import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import Modal from "./Modal";
import { Button } from "./button";
import { useFormBuilderStore } from "~/stores/formBuilder";
import { FormTemplateService } from "~/services/templateService";
import toast from "react-hot-toast";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: {
    form_name: string;
    description?: string;
    tags?: string[];
    expiry_date?: string;
  }) => Promise<void>;
  isEditMode?: boolean;
  templateId?: string;
}

export default function SaveTemplateModal({
  isOpen,
  onClose,
  onSave,
  isEditMode = false,
  templateId,
}: SaveTemplateModalProps) {
  const { formName: canvasFormName } = useFormBuilderStore();
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<Dayjs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Load existing template data when in edit mode
  useEffect(() => {
    const loadTemplateData = async () => {
      if (isOpen && isEditMode && templateId) {
        try {
          setIsLoadingTemplate(true);
          const template = await FormTemplateService.getTemplateById(
            templateId
          );

          if (template) {
            // ALWAYS use form name from canvas, not from template data
            setFormName(canvasFormName.trim() || template.form_name);
            setDescription(template.description || "");
            setTags(template.tags || []);
            setExpiryDate(
              template.expiry_date ? dayjs(template.expiry_date) : null
            );
          }
        } catch (error) {
          console.error("Error loading template data:", error);
          toast.error("Failed to load template data");
        } finally {
          setIsLoadingTemplate(false);
        }
      } else if (isOpen && !isEditMode) {
        // Auto-populate form name from canvas when creating new template
        if (canvasFormName && canvasFormName.trim()) {
          setFormName(canvasFormName.trim());
        }
      }
    };

    loadTemplateData();
  }, [isOpen, isEditMode, templateId, canvasFormName]);

  // Update form name when canvas form name changes (for edit mode)
  useEffect(() => {
    if (isOpen && isEditMode && canvasFormName && canvasFormName.trim()) {
      setFormName(canvasFormName.trim());
    }
  }, [canvasFormName, isOpen, isEditMode]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getExpiryStatus = () => {
    if (!expiryDate) {
      return {
        status: "infinite",
        text: "Form will be open indefinitely",
        color: "text-blue-600 dark:text-blue-400",
      };
    }

    const selectedDate = expiryDate.toDate();
    const now = new Date();

    if (selectedDate < now) {
      return {
        status: "closed",
        text: "Form will be closed (expires in the past)",
        color: "text-red-600 dark:text-red-400",
      };
    } else {
      return {
        status: "open",
        text: `Form will be open until ${selectedDate.toLocaleString()}`,
        color: "text-green-600 dark:text-green-400",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Form name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert dayjs to ISO string with timezone for backend
      const expiryTimestamp = expiryDate ? expiryDate.toISOString() : undefined;

      await onSave({
        form_name: formName.trim(),
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        expiry_date: expiryTimestamp,
      });

      // Only reset form if not in edit mode
      if (!isEditMode) {
        setFormName("");
        setDescription("");
        setTags([]);
        setTagInput("");
        setExpiryDate(null);
      }
      onClose();
    } catch (error) {
      console.error("Save template error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Only reset if not in edit mode
      if (!isEditMode) {
        setFormName("");
        setDescription("");
        setTags([]);
        setTagInput("");
        setExpiryDate(null);
      }
      onClose();
    }
  };

  const expiryStatus = getExpiryStatus();

  if (isLoadingTemplate) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditMode ? "Update Template" : "Save as Template"}
        size="md"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading template data...
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Update Template" : "Save as Template"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter template name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isSubmitting}
            maxLength={255}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode
              ? "Using current form title from canvas"
              : "Auto-filled from your form title"}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this template is for..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            disabled={isSubmitting}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (Optional)
          </label>

          {/* Existing Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Press Enter to add tags. Great for categorizing templates (e.g.,
            "survey", "feedback", "registration")
          </p>
        </div>

        {/* Expiry Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Form Expiry Date & Time (Optional)
          </label>
          <DatePicker
            showTime
            value={expiryDate}
            onChange={(date) => setExpiryDate(date)}
            placeholder="Select expiry date and time"
            className="w-full"
            disabled={isSubmitting}
            format="YYYY-MM-DD HH:mm"
          />

          {/* Dynamic Status Indicator */}
          <div className={`text-xs mt-2 ${expiryStatus.color}`}>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Status:</span>
              <span>{expiryStatus.text}</span>
            </div>
          </div>

          {/* Helper Text */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
            <div>
              <strong>Leave empty:</strong> Form stays open indefinitely
            </div>
            <div>
              <strong>Past date:</strong> Form will be closed/expired
            </div>
            <div>
              <strong>Future date:</strong> Form opens until that date & time
            </div>
            <div className="text-xs opacity-75 mt-1">
              Time is in your local timezone (
              {Intl.DateTimeFormat().resolvedOptions().timeZone})
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formName.trim()}
            className={`${
              isEditMode
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditMode ? "Updating..." : "Saving..."}</span>
              </div>
            ) : isEditMode ? (
              "Update Template"
            ) : (
              "Save Template"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
