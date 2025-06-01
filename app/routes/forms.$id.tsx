import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";
import {
  FormTemplateService,
  type FormTemplate,
} from "~/services/templateService";
import { FormSubmissionService } from "~/services/submissionService";
import { useFormBuilderStore } from "~/stores/formBuilder";
import FormPreview from "~/components/ui/FormPreview";
import toast from "react-hot-toast";

export default function PublicFormPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loadTemplate } = useFormBuilderStore();

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) {
        setError("Invalid form ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedTemplate = await FormTemplateService.getTemplateById(id);

        if (!fetchedTemplate) {
          setError("Form not found");
          return;
        }

        // Check if form is active (not expired)
        if (FormTemplateService.isTemplateExpired(fetchedTemplate)) {
          setError(
            "This form has expired and is no longer accepting submissions"
          );
          return;
        }

        setTemplate(fetchedTemplate);

        // Load the template into the store for FormPreview to use
        loadTemplate({
          formName: fetchedTemplate.form_name,
          sections: fetchedTemplate.form_structure,
          templateId: fetchedTemplate.id,
        });
      } catch (error) {
        console.error("Error fetching template:", error);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, loadTemplate]);

  const handleFormSubmission = async (formData: Record<string, any>) => {
    if (!id || !template) {
      toast.error("Form information is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Submitting form data:", {
        formId: id,
        formName: template.form_name,
        submittedAt: new Date().toISOString(),
        formData,
      });

      // Submit to backend
      const submission = await FormSubmissionService.createSubmission({
        form_id: id,
        form_data: formData,
      });

      console.log("✅ Form submitted successfully:", submission);

      toast.success(
        "Form submitted successfully! Thank you for your response.",
        {
          duration: 5000,
          icon: "✅",
        }
      );

      return submission;
    } catch (error) {
      console.error("❌ Form submission error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      toast.error(`Failed to submit form: ${errorMessage}`, {
        duration: 7000,
        icon: "❌",
      });

      // Re-throw the error so FormPreview can handle it
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Form Unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {template?.form_name || "Form"}
          </h1>
          {template?.description && (
            <p className="text-blue-100 max-w-2xl mx-auto">
              {template.description}
            </p>
          )}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
          <FormPreview
            mode="submission"
            onSubmit={handleFormSubmission}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">
          Powered by{" "}
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            FormBuilder
          </a>
        </p>
      </div>
    </div>
  );
}
