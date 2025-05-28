import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox, Radio } from "antd";
import DraggableField from "./DraggableField";
import { fieldGroups } from "~/helpers/fieldGroups";

// Component for rendering small field preview

export function FieldPreview({ type }: { type: string }) {
  switch (type) {
    case "text":
      return (
        <input
          type="text"
          placeholder="Text input"
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      );
    case "textarea":
      return (
        <textarea
          placeholder="Textarea"
          disabled
          rows={2}
          className="w-full border rounded px-2 py-1 text-sm resize-none bg-gray-50 dark:bg-zinc-800"
        />
      );
    case "email":
      return (
        <input
          type="email"
          placeholder="Email"
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      );
    case "phone":
      return (
        <input
          type="tel"
          placeholder="Phone number"
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox disabled>
            <span className="text-sm">Checkbox</span>
          </Checkbox>
        </div>
      );
    case "radio":
      return (
        <div className="flex items-center space-x-2">
          <Radio disabled>
            <span className="text-sm">Radio Button</span>
          </Radio>
        </div>
      );
    case "dropdown":
      return (
        <select
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        >
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      );
    case "date":
      return (
        <input
          type="date"
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      );
    case "time":
      return (
        <input
          type="time"
          disabled
          className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-zinc-800"
        />
      );
    default:
      return <div>Unknown field</div>;
  }
}

export default function FieldPalette() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative h-full transition-all duration-300 ${
        collapsed ? "w-4" : "w-[30rem]"
      } bg-gray-100 dark:bg-zinc-900 border-r flex-shrink-0`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-800 border rounded-full p-1 shadow"
        aria-label={
          collapsed ? "Expand field palette" : "Collapse field palette"
        }
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {!collapsed && (
        <div
          className="p-4 space-y-6 overflow-y-auto max-h-full pt-20 box-border scrollbar-hide"
          style={{ scrollbarWidth: "none" }} // Firefox-specific
        >
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Fields
          </h2>

          {fieldGroups.map(({ groupName, fields }) => (
            <div key={groupName} className="mb-6 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {groupName}
              </h3>
              <div className="flex flex-col gap-3">
                {fields.map(({ type, label }) => (
                  <DraggableField key={type} type={type} label={label} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
