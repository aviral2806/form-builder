import { useState, useEffect } from "react";
import { useParams, Link } from "@remix-run/react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Eye,
  X,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { FormSubmissionService } from "~/services/submissionService";
import toast from "react-hot-toast";

interface FormSubmission {
  id: string;
  created_at: string;
  form_id: string;
  form_data: Record<string, any>;
}

export default function ResponsesPage() {
  const { id: formId } = useParams();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!formId) return;

      try {
        const data = await FormSubmissionService.getSubmissionsForForm(formId);
        setSubmissions(data);
      } catch (error) {
        console.error("Error loading submissions:", error);
        toast.error("Failed to load responses");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [formId]);

  // Sort submissions
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyResponses = submissions.filter(
    (s) => new Date(s.created_at) >= today
  ).length;
  const weeklyResponses = submissions.filter(
    (s) => new Date(s.created_at) >= weekAgo
  ).length;
  const monthlyResponses = submissions.filter(
    (s) => new Date(s.created_at) >= monthAgo
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "No answer";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading responses...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-zinc-900 pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/my-forms"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to My Forms
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Form Responses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total responses: {submissions.length}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Daily
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {dailyResponses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Weekly
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {weeklyResponses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {monthlyResponses}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Control */}
          <div className="mb-6">
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Responses Table */}
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No responses yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your form to start collecting responses
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Response
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedSubmissions.map((submission, index) => (
                    <tr
                      key={submission.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Response #
                          {sortOrder === "newest"
                            ? submissions.length - index
                            : index + 1}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {Object.keys(submission.form_data).length} fields
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(submission.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-gray-500 dark:bg-zinc-900 opacity-75"
              onClick={() => setSelectedSubmission(null)}
            ></div>

            <div className="inline-block w-full max-w-2xl text-left align-middle transition-all transform bg-white dark:bg-zinc-800 shadow-xl rounded-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Response Details
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted: {formatDate(selectedSubmission.created_at)}
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(selectedSubmission.form_data).map(
                    ([field, value]) => (
                      <div
                        key={field}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <dt className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {field}
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100">
                          {formatValue(value)}
                        </dd>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 dark:bg-zinc-700 text-right">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
