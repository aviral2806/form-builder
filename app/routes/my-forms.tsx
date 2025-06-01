import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import {
  Plus,
  FileText,
  Calendar,
  Tag,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useAuth } from "~/hooks/useAuth";

// Placeholder for form data structure
interface UserForm {
  id: string;
  form_name: string;
  description?: string;
  tags?: string[];
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  response_count?: number; // For future use
}

export default function MyFormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Mock data for now - replace with actual API call later
  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockForms: UserForm[] = [
          {
            id: "1",
            form_name: "Customer Feedback Survey",
            description: "Collect customer feedback and satisfaction ratings",
            tags: ["survey", "feedback", "customer"],
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-20T14:45:00Z",
            response_count: 45,
          },
          {
            id: "2",
            form_name: "Job Application Form",
            description:
              "Complete job application with personal and professional details",
            tags: ["hr", "recruitment"],
            expiry_date: "2024-12-31T23:59:59Z",
            created_at: "2024-01-10T09:15:00Z",
            updated_at: "2024-01-10T09:15:00Z",
            response_count: 12,
          },
        ];
        setForms(mockForms);
        setLoading(false);
      }, 1000);
    };

    fetchForms();
  }, []);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Forms
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and view all your created forms
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
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Tag Filter */}
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
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
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Form Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {form.form_name}
                      </h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {form.description}
                        </p>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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

                  {/* Status & Dates */}
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
                          {formatDate(form.expiry_date)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Created: {formatDate(form.created_at)}
                    </div>
                    {form.response_count !== undefined && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {form.response_count} responses
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/builder/${form.id}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <button className="inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-1" />
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
