import { Field, FieldOption } from "~/stores/formBuilder";
import { Tooltip } from "antd";
import { HelpCircle } from "lucide-react";

interface TextFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function TextFieldEditor({
  updateOption,
  getOptionValue,
}: TextFieldEditorProps) {
  const minLength = getOptionValue("minLength", 0);
  const maxLength = getOptionValue("maxLength", 0);
  const pattern = getOptionValue("pattern", "");

  // Helper function to convert simple pattern to regex and generate error message
  const processPattern = (simplePattern: string) => {
    if (!simplePattern.trim()) return null;

    const trimmed = simplePattern.trim();

    // Check if it uses % wildcards
    if (trimmed.includes("%")) {
      if (trimmed.startsWith("%") && trimmed.endsWith("%")) {
        // %pattern% - must contain
        const content = trimmed.slice(1, -1);
        return {
          regex: new RegExp(content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
          errorMessage: `Must contain "${content}"`,
        };
      } else if (trimmed.endsWith("%")) {
        // pattern% - must start with
        const content = trimmed.slice(0, -1);
        return {
          regex: new RegExp(
            `^${content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
          ),
          errorMessage: `Must start with "${content}"`,
        };
      } else if (trimmed.startsWith("%")) {
        // %pattern - must end with
        const content = trimmed.slice(1);
        return {
          regex: new RegExp(
            `${content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
          ),
          errorMessage: `Must end with "${content}"`,
        };
      }
    } else {
      // Exact match
      return {
        regex: new RegExp(
          `^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
        ),
        errorMessage: `Must be exactly "${trimmed}"`,
      };
    }

    return null;
  };

  // Generate pattern hint for display
  const getPatternHint = () => {
    if (!pattern) return null;

    const patternInfo = processPattern(pattern);
    if (patternInfo) {
      return patternInfo.errorMessage
        .replace("Must be", "Will be")
        .replace("Must", "Will");
    }
    return "Will match the specified format";
  };

  // Validate min/max length combination
  const getLengthValidationMessage = () => {
    if (minLength > 0 && maxLength > 0) {
      if (minLength > maxLength) {
        return "⚠️ Min length cannot be greater than max length";
      } else if (minLength === maxLength) {
        return `✓ Text must be exactly ${minLength} characters`;
      } else {
        return `✓ Text must be between ${minLength} and ${maxLength} characters`;
      }
    } else if (minLength > 0) {
      return `✓ Text must be at least ${minLength} characters`;
    } else if (maxLength > 0) {
      return `✓ Text must be no more than ${maxLength} characters`;
    }
    return null;
  };

  const lengthMessage = getLengthValidationMessage();
  const isLengthError = minLength > 0 && maxLength > 0 && minLength > maxLength;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Text Field Options
      </h3>

      {/* Length Validation Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Length Validation
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Min Length</label>
            <input
              type="number"
              value={minLength || ""}
              onChange={(e) =>
                updateOption(
                  "minLength",
                  parseInt(e.target.value) || 0,
                  "number"
                )
              }
              className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 transition-colors ${
                isLengthError
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Length</label>
            <input
              type="number"
              value={maxLength || ""}
              onChange={(e) =>
                updateOption(
                  "maxLength",
                  parseInt(e.target.value) || 0,
                  "number"
                )
              }
              className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 transition-colors ${
                isLengthError
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              min="0"
              placeholder="No limit"
            />
          </div>
        </div>

        {/* Length validation message */}
        {lengthMessage && (
          <div
            className={`text-xs p-2 rounded ${
              isLengthError
                ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                : "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
            }`}
          >
            {lengthMessage}
          </div>
        )}
      </div>

      {/* Pattern Validation Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Pattern Validation
          </h4>
          <Tooltip
            title={
              <div className="space-y-2">
                <div className="font-medium">Pattern Examples:</div>
                <div>
                  <strong>%pattern%</strong> - Must contain "pattern"
                </div>
                <div>
                  <strong>pattern%</strong> - Must start with "pattern"
                </div>
                <div>
                  <strong>%pattern</strong> - Must end with "pattern"
                </div>
                <div>
                  <strong>abc123</strong> - Must be exactly "abc123"
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Use % as wildcard for flexible matching
                </div>
              </div>
            }
            placement="top"
            overlayStyle={{ maxWidth: "300px" }}
          >
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </div>

        <input
          type="text"
          value={pattern}
          onChange={(e) => updateOption("pattern", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-gray-600"
          placeholder="e.g., %@gmail.com, USER%, %123, or abc123"
        />

        {/* Pattern preview */}
        {pattern && (
          <div className="text-xs p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <div className="font-medium">Pattern Preview:</div>
            <div>{getPatternHint() || "Invalid pattern format"}</div>
          </div>
        )}

        {/* Pattern help */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            • Use{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
              %text%
            </code>{" "}
            to require "text" anywhere in input
          </div>
          <div>
            • Use{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
              text%
            </code>{" "}
            to require input starts with "text"
          </div>
          <div>
            • Use{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
              %text
            </code>{" "}
            to require input ends with "text"
          </div>
          <div>
            • Use{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
              text
            </code>{" "}
            to require exact match
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {(minLength > 0 || maxLength > 0 || pattern) && (
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Validation Summary
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {!isLengthError && lengthMessage && (
              <div className="flex items-center space-x-1">
                <span className="text-green-500">✓</span>
                <span>{lengthMessage.replace("✓ ", "")}</span>
              </div>
            )}
            {pattern && getPatternHint() && (
              <div className="flex items-center space-x-1">
                <span className="text-blue-500">◉</span>
                <span>{getPatternHint()}</span>
              </div>
            )}
            {!minLength && !maxLength && !pattern && (
              <div className="text-gray-500 italic">
                No validation rules set
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
