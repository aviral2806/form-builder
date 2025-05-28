import { Link } from "@remix-run/react";

export default function LandingPage() {
  const user = null; // Replace with actual auth logic
  const userForms = []; // Replace with real fetched forms

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              🧩 Drag & Drop
            </h3>
            <p className="dark:text-gray-300">
              Create your form layout visually with support for text,
              checkboxes, dropdowns, and more.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              📱 Responsive Preview
            </h3>
            <p className="dark:text-gray-300">
              Preview your form in desktop, tablet, and mobile views as you
              build.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-md transition border dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              📤 Share & Collect
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
          <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">
            📂 Your Forms
          </h2>
          {userForms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userForms.map((form) => (
                <Link
                  key={form.id}
                  to={`/builder/${form.id}`}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow transition"
                >
                  <h3 className="font-semibold text-lg dark:text-gray-100">
                    {form.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {form.fields.length} fields
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              You havent created any forms yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
