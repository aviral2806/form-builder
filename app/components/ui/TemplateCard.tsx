import { Clock, Users, Star } from "lucide-react";
import type { Template } from "~/types/template";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  isSelected?: boolean;
}

export default function TemplateCard({
  template,
  onSelect,
  isSelected = false,
}: TemplateCardProps) {
  const fieldCount = template.structure.sections.reduce(
    (total, section) => total + section.fields.length,
    0
  );

  return (
    <div
      onClick={() => onSelect(template)}
      className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md group ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      {/* Popular badge */}
      {template.isPopular && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Popular
        </div>
      )}

      {/* Template content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {template.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Template stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{fieldCount} fields</span>
            </div>
            {template.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{template.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
}
