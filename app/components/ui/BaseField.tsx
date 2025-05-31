import { ReactNode } from "react";
import { Pen, LucideTrash2 } from "lucide-react";

interface BaseFieldProps {
  children: ReactNode;
  fieldId: string;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function BaseField({
  children,
  fieldId,
  onEdit,
  onDelete,
}: BaseFieldProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any event bubbling
    console.log("✏️ Edit clicked for field:", fieldId);
    onEdit?.(fieldId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any event bubbling
    console.log("🗑️ Delete clicked for field:", fieldId);
    onDelete?.(fieldId);
  };

  return (
    <div className="mb-4 relative group border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow hover:shadow-md transition-shadow">
      {children}

      {/* Edit and Delete buttons - shown on hover */}
      <div className="absolute top-[6px] right-[20px] opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          onClick={handleEdit}
          className="p-1.5 bg-gray-100/80 hover:bg-gray-200/90 dark:bg-gray-700/80 dark:hover:bg-gray-600/90 dark:text-white rounded-full text-xs transition-all duration-200"
          title="Edit field"
          type="button"
        >
          <Pen className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 bg-gray-100/80 hover:bg-red-100/90 dark:bg-gray-700/80 dark:hover:bg-red-900/50 text-gray-700 hover:text-red-600 dark:text-white dark:hover:text-red-400 rounded-full text-xs transition-all duration-200"
          title="Delete field"
          type="button"
        >
          <LucideTrash2 className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
