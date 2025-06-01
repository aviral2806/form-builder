import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useAuth } from "~/hooks/useAuth";
import {
  FormTemplateService,
  type FormTemplate,
} from "~/services/templateService";
import {
  Plus,
  FileText,
  Clock,
  MousePointer2,
  Monitor,
  Share2,
  FolderOpen,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const [userForms, setUserForms] = useState<FormTemplate[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);

  // Fetch user's forms when user is available
  useEffect(() => {
    const fetchUserForms = async () => {
      if (!user) {
        setUserForms([]);
        return;
      }

      try {
        setFormsLoading(true);
        console.log("📊 Fetching user forms for landing page...");
        const forms = await FormTemplateService.getUserTemplates();
        console.log("✅ Fetched forms:", forms.length);
        setUserForms(forms);
      } catch (error) {
        console.error("❌ Error fetching user forms:", error);
        toast.error("Failed to load your forms");
        setUserForms([]);
      } finally {
        setFormsLoading(false);
      }
    };

    fetchUserForms();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFieldCount = (form: FormTemplate) => {
    return form.form_structure.reduce(
      (total, section) => total + section.fields.length,
      0
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400 dark:from-red-700 dark:via-orange-600 dark:to-yellow-500 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold my-5">
          Design Forms Visually. Fast.
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Drag, drop, and build beautiful multi-step forms with real-time
          preview, templates, and sharing – all in your browser.
        </p>
        <Link
          to="/builder"
          className="inline-block bg-white dark:bg-gray-800 text-red-600 dark:text-orange-400 font-semibold px-8 py-3 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          ✨ Start Building
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 dark:text-gray-100">
          Why FormBuilder?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-zinc-800">
            <div className="flex justify-center mb-4">
              <MousePointer2 className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Drag & Drop
            </h3>
            <p className="dark:text-gray-300">
              Create your form layout visually with support for text,
              checkboxes, dropdowns, and more.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-zinc-800">
            <div className="flex justify-center mb-4">
              <Monitor className="w-12 h-12 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Responsive Preview
            </h3>
            <p className="dark:text-gray-300">
              Preview your form in desktop, tablet, and mobile views as you
              build.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-zinc-800">
            <div className="flex justify-center mb-4">
              <Share2 className="w-12 h-12 text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Share & Collect
            </h3>
            <p className="dark:text-gray-300">
              Generate shareable links and track responses with ease.
            </p>
          </div>
        </div>
      </section>

      {/* User's Forms Section */}
      {user && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold dark:text-gray-100">
                Your Forms
              </h2>
            </div>
            <Link
              to="/my-forms"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {formsLoading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading your forms...
              </p>
            </div>
          ) : userForms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userForms.slice(0, 6).map((form) => (
                <div
                  key={form.id}
                  className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border dark:border-gray-700 hover:shadow transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {form.form_name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        FormTemplateService.isTemplateExpired(form)
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          FormTemplateService.isTemplateExpired(form)
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      {FormTemplateService.isTemplateExpired(form)
                        ? "Inactive"
                        : "Active"}
                    </span>
                  </div>

                  {form.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {form.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Sections:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {form.form_structure.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Fields:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getFieldCount(form)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {formatDate(form.created_at)}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Link
                      to={`/builder?edit=${form.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Edit
                    </Link>
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/responses/${form.id}`}
                        className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Responses
                      </Link>
                      <button
                        onClick={() => {
                          const publicUrl = `${window.location.origin}/forms/${form.id}`;
                          window.open(publicUrl, "_blank");
                        }}
                        disabled={FormTemplateService.isTemplateExpired(form)}
                        className={`text-sm font-medium ${
                          FormTemplateService.isTemplateExpired(form)
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        }`}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No forms yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first form to get started with FormBuilder
              </p>
              <Link
                to="/builder"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Link>
            </div>
          )}

          {userForms.length > 6 && (
            <div className="text-center mt-8">
              <Link
                to="/my-forms"
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                View All {userForms.length} Forms
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
