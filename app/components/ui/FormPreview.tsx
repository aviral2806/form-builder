import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Send } from "lucide-react";
import { useFormBuilderStore } from "~/stores/formBuilder";
import type { Field } from "~/stores/formBuilder";
import TextField from "./fields/TextField";
import TextareaField from "./fields/TextareaField";
import EmailField from "./fields/EmailField";
import PhoneField from "./fields/PhoneField";
import CheckboxField from "./fields/CheckboxField";
import RadioField from "./fields/RadioField";
import DropdownField from "./fields/DropdownField";
import DateField from "./fields/DateField";

interface FormPreviewProps {
  mode?: "preview" | "submission";
  onSubmit?: (formData: Record<string, any>) => Promise<any>;
  isSubmitting?: boolean;
}

interface FieldValidation {
  fieldId: string;
  isValid: boolean;
  errors: string[];
}

export default function FormPreview({
  mode = "preview",
  onSubmit,
  isSubmitting: externalIsSubmitting = false,
}: FormPreviewProps) {
  const { formName, sections } = useFormBuilderStore();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sectionValidations, setSectionValidations] = useState<
    Record<number, FieldValidation[]>
  >({});
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set()
  );
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Track field validation states
  const [fieldValidationStates, setFieldValidationStates] = useState<
    Record<string, { isValid: boolean; errors: string[] }>
  >({});

  // Use external submitting state if provided, otherwise use internal
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  useEffect(() => {
    // Initialize validation states for all fields
    const initialStates: Record<
      string,
      { isValid: boolean; errors: string[] }
    > = {};
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        // Initialize as valid only for non-required fields with no value
        initialStates[field.id] = { isValid: !field.required, errors: [] };
      });
    });
    setFieldValidationStates(initialStates);
  }, [sections]);

  // Update field validation state
  const updateFieldValidation = (
    fieldId: string,
    isValid: boolean,
    errors: string[] = []
  ) => {
    setFieldValidationStates((prev) => ({
      ...prev,
      [fieldId]: { isValid, errors },
    }));
  };

  // Update form data - ENHANCED VERSION
  const updateFormData = (fieldId: string, value: any) => {
    console.log(`📝 Field ${fieldId} updated with value:`, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [fieldId]: value,
      };
      console.log("📊 Current form data:", newData);
      return newData;
    });
  };

  // Check if current section is valid
  const isCurrentSectionValid = () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return false;

    return currentSection.fields.every((field) => {
      const fieldState = fieldValidationStates[field.id];
      const fieldValue = formData[field.id];
      const hasValue =
        fieldValue !== undefined && fieldValue !== null && fieldValue !== "";

      // For required fields: must be valid
      if (field.required) {
        return fieldState?.isValid === true;
      }

      // For non-required fields: if no value, it's valid; if has value, it must be valid
      if (!hasValue) {
        return true; // Empty non-required field is valid
      } else {
        return fieldState?.isValid === true; // Non-empty non-required field must be valid
      }
    });
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (sections.length === 0) return 0;
    if (isSubmitting || isSubmitted) return 100; // Complete on submit

    // Simple calculation: current section position as percentage
    return (currentSectionIndex / sections.length) * 100;
  };

  // Navigate to next section
  const handleNext = () => {
    if (isCurrentSectionValid()) {
      setCompletedSections((prev) => new Set([...prev, currentSectionIndex]));
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    }
  };

  // Navigate to previous section
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // ENHANCED Handle form submission with error handling
  const handleSubmit = async () => {
    if (!isCurrentSectionValid()) {
      return;
    }

    // Mark current section as completed
    setCompletedSections((prev) => new Set([...prev, currentSectionIndex]));

    // Clear any previous submission errors
    setSubmissionError(null);

    // Start submission animation
    setInternalIsSubmitting(true);

    try {
      // Prepare final form data with field labels for better readability
      const finalFormData: Record<string, any> = {};

      sections.forEach((section) => {
        section.fields.forEach((field) => {
          const fieldValue = formData[field.id];
          if (
            fieldValue !== undefined &&
            fieldValue !== null &&
            fieldValue !== ""
          ) {
            finalFormData[field.label] = fieldValue;
          }
        });
      });

      console.log("🔥 Final form data being submitted:", finalFormData);
      console.log("🔥 Raw form data by field ID:", formData);

      if (onSubmit) {
        // Real submission
        await onSubmit(finalFormData);
        setIsSubmitted(true);

        if (mode === "preview") {
          // For preview mode, show success and reset after delay
          setTimeout(() => {
            setInternalIsSubmitting(false);
            setIsSubmitted(false);
          }, 3000);
        }
      } else {
        // Mock submission for preview mode
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("📝 Form Data Preview:", finalFormData);
        setIsSubmitted(true);

        if (mode === "preview") {
          setTimeout(() => {
            setInternalIsSubmitting(false);
            setIsSubmitted(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("❌ Submission error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while submitting the form";

      setSubmissionError(errorMessage);
      setInternalIsSubmitting(false);
    } finally {
      if (mode === "submission" && !submissionError) {
        // Keep submitted state for successful public form submissions
        setInternalIsSubmitting(false);
      }
    }
  };

  // Render field with validation callbacks - FIXED VERSION
  const renderField = (field: Field) => {
    const fieldProps = {
      field,
      mode: mode as "preview" | "submission",
      onValidation: (isValid: boolean, errors: string[]) => {
        console.log(`🔍 Validation for field "${field.label}" (${field.id}):`, {
          isValid,
          errors,
          mode,
        });
        updateFieldValidation(field.id, isValid, errors);
      },
      onValueChange: (value: any) => {
        console.log(
          `🔄 Field "${field.label}" (${field.id}) changed to:`,
          value,
          `(mode: ${mode})`
        );
        updateFormData(field.id, value);
      },
      initialValue: formData[field.id],
    };

    switch (field.type) {
      case "text":
        return <TextField key={field.id} {...fieldProps} />;
      case "textarea":
        return <TextareaField key={field.id} {...fieldProps} />;
      case "email":
        return <EmailField key={field.id} {...fieldProps} />;
      case "phone":
        return <PhoneField key={field.id} {...fieldProps} />;
      case "checkbox":
        return <CheckboxField key={field.id} {...fieldProps} />;
      case "radio":
        return <RadioField key={field.id} {...fieldProps} />;
      case "dropdown":
        return <DropdownField key={field.id} {...fieldProps} />;
      case "date":
        return <DateField key={field.id} {...fieldProps} />;
      default:
        return (
          <div
            key={field.id}
            className="p-2 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 text-red-800 dark:text-red-200"
          >
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;
  const canProceed = isCurrentSectionValid();

  // Show submission success for public forms
  if (mode === "submission" && isSubmitted) {
    return (
      <div className="bg-white dark:bg-zinc-900 h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your form has been submitted successfully. We'll get back to you
            soon!
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Form: {formName}</p>
            <p>Submitted: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 h-full flex items-center justify-center p-4 sm:p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No sections added to the form yet.</p>
          <p className="text-sm mt-2">
            Add some sections and fields to see the preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 h-full flex flex-col">
      {/* Header with Form Name and Progress - Responsive */}
      <div className="border-b border-gray-200 dark:border-zinc-700 p-4 sm:p-6 pb-4 flex-shrink-0">
        {mode === "submission" && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please fill out all required fields to submit the form
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                ? "Completed!"
                : `${Math.round(getProgressPercentage())}% Complete`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                isSubmitting
                  ? "bg-blue-500"
                  : isSubmitted
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Section Navigation - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Section {currentSectionIndex + 1} of {sections.length}
            </span>
            {completedSections.has(currentSectionIndex) && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>

          {/* Section indicators */}
          <div className="flex space-x-1">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  completedSections.has(index)
                    ? "bg-green-500"
                    : index === currentSectionIndex
                    ? "bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Section Content - Take remaining height */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        {/* Section Title */}
        <div className="border-b border-gray-100 dark:border-zinc-700 pb-3 mb-4 sm:mb-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
            {currentSection.title || `Section ${currentSectionIndex + 1}`}
          </h2>
        </div>

        {/* Section Fields - Take remaining space */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 space-y-3 sm:space-y-4 mb-6">
            {currentSection.fields.length > 0 ? (
              currentSection.fields.map((field) => renderField(field))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                  No fields in this section
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons - Always at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-zinc-700 pt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <button
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0 || isSubmitting}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors w-full sm:w-auto ${
                  currentSectionIndex === 0 || isSubmitting
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {isLastSection ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-md transition-colors w-full sm:w-auto ${
                    canProceed && !isSubmitting
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {mode === "submission"
                          ? "Submit Form"
                          : "Submit (Preview)"}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed || isSubmitting}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors w-full sm:w-auto ${
                    canProceed && !isSubmitting
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Submission Error Message */}
            {submissionError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start space-x-2">
                  <div className="text-red-500 text-sm font-medium">❌</div>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      Submission Failed
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {submissionError}
                    </p>
                    <button
                      onClick={() => setSubmissionError(null)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 mt-2 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Messages */}
            {!canProceed &&
              currentSection.fields.length > 0 &&
              !isSubmitting &&
              !submissionError && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please fill in all required fields correctly to continue.
                  </p>
                </div>
              )}

            {/* Submission Progress Message */}
            {isSubmitting && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {mode === "submission"
                      ? "Submitting your response to the server..."
                      : "Processing form preview..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
