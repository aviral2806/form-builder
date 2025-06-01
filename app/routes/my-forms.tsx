import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import {
  Plus,
  FileText,
  Calendar,
  Tag,
  Clock,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Copy,
  Share2,
} from "lucide-react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useAuth } from "~/hooks/useAuth";
import {
  FormTemplateService,
  type FormTemplate,
} from "~/services/templateService";
import toast from "react-hot-toast";

export default function MyFormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);

  // Fetch user's templates from Supabase
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const userTemplates = await FormTemplateService.getUserTemplates();
        console.log("📊 Fetched forms:", userTemplates.length);
        setForms(userTemplates);
      } catch (error) {
        console.error("❌ Error fetching forms:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load your forms"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchForms();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Get all unique tags from forms
  const allTags = Array.from(
    new Set(forms.flatMap((form) => form.tags || []))
  ).sort();

  // Filter forms based on search and tag
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || form.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Enhanced date formatting to include time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isFormActive = (form: FormTemplate) => {
    return !FormTemplateService.isTemplateExpired(form);
  };

  const copyPublicLink = (formId: string, formName: string) => {
    const publicUrl = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        toast.success(`Public link for "${formName}" copied to clipboard!`, {
          duration: 3000,
          icon: "📋",
        });
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard");
      });
  };

  const openPublicForm = (formId: string) => {
    const publicUrl = `${window.location.origin}/forms/${formId}`;
    window.open(publicUrl, "_blank");
  };

  const handleDeleteForm = async (formId: string, formName: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500">🗑️</span>
            <span className="font-medium">Delete "{formName}"?</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  setDeletingFormId(formId);
                  console.log("🗑️ Starting delete for form:", formId);

                  await FormTemplateService.deleteTemplate(formId);

                  setForms((prev) => prev.filter((form) => form.id !== formId));

                  toast.success(`"${formName}" deleted successfully`);
                  console.log("✅ Form deleted successfully:", formId);
                } catch (error) {
                  console.error("❌ Error deleting form:", error);
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to delete form"
                  );
                } finally {
                  setDeletingFormId(null);
                }
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading your forms...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-zinc-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Forms
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and view all your created forms ({forms.length} total)
              </p>
            </div>
            <Link
              to="/builder"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Form
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {allTags.length > 0 && (
              <div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Forms List */}
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {forms.length === 0 ? "No forms yet" : "No forms found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {forms.length === 0
                  ? "Create your first form to get started"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {forms.length === 0 && (
                <Link
                  to="/builder"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Form Header - REMOVED 3 DOTS MENU */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {form.form_name}
                    </h3>
                    {form.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>

                  {/* Form Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        isFormActive(form)
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {isFormActive(form) ? "🟢 Active" : "🔴 Inactive"}
                    </span>
                  </div>

                  {/* Form Stats */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Sections:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {form.form_structure.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Fields:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {form.form_structure.reduce(
                          (total, section) => total + section.fields.length,
                          0
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {form.tags && form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status & Dates - ENHANCED WITH TIME */}
                  <div className="space-y-2 mb-4">
                    {form.expiry_date && (
                      <div className="flex items-center text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span
                          className={
                            isExpired(form.expiry_date)
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }
                        >
                          {isExpired(form.expiry_date) ? "Expired" : "Expires"}:{" "}
                          {formatDateTime(form.expiry_date)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Created: {formatDate(form.created_at)}
                    </div>
                    {form.updated_at !== form.created_at && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated: {formatDate(form.updated_at)}
                      </div>
                    )}
                  </div>

                  {/* Public Form Link Section */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        Public Form Link
                      </span>
                      <Share2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyPublicLink(form.id, form.form_name)}
                        disabled={!isFormActive(form)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                          isFormActive(form)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        }`}
                        title={
                          isFormActive(form)
                            ? "Copy public link"
                            : "Form is inactive"
                        }
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                      <button
                        onClick={() => openPublicForm(form.id)}
                        disabled={!isFormActive(form)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                          isFormActive(form)
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        }`}
                        title={
                          isFormActive(form)
                            ? "Open public form"
                            : "Form is inactive"
                        }
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </button>
                    </div>
                    {!isFormActive(form) && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Form is inactive and cannot receive submissions
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/builder?edit=${form.id}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <Link
                        to={`/responses/${form.id}`}
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Responses
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteForm(form.id, form.form_name)}
                      disabled={deletingFormId === form.id}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingFormId === form.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
