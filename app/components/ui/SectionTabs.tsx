import { useFormBuilder } from "~/stores/formBuilder";

export default function SectionTabs() {
  const { sections, activeSectionId, setActiveSection, addSection } =
    useFormBuilder();

  return (
    <div className="flex space-x-2 px-4 py-2 border-b bg-white dark:bg-zinc-900">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => setActiveSection(s.id)}
          className={`px-3 py-1 rounded ${
            s.id === activeSectionId
              ? "bg-red-600 text-white"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          {s.name}
        </button>
      ))}
      <button
        onClick={() => addSection(`Section ${sections.length + 1}`)}
        className="ml-auto text-sm text-red-600 hover:underline"
      >
        + Add Section
      </button>
    </div>
  );
}
