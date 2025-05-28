import BaseField from "../BaseField";
import { Radio } from "antd";
import type { Field } from "~/stores/formBuilder";

interface RadioFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
}

export default function RadioField({
  field,
  onEdit,
  onDelete,
}: RadioFieldProps) {
  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const options = getOptionValue("options", ["Option 1", "Option 2"]);
  const defaultSelection = getOptionValue("defaultSelection", "");
  const layout = getOptionValue("layout", "vertical");

  const getRadioOptions = () => {
    return options.map((option: string) => ({
      label: option,
      value: option,
    }));
  };

  const getDirection = () => {
    switch (layout) {
      case "horizontal":
        return "horizontal";
      case "grid":
        return "horizontal"; // Ant Design doesn't have grid, use horizontal
      default:
        return "vertical";
    }
  };

  const getStyle = () => {
    if (layout === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "8px",
      };
    }
    return {};
  };

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </div>

        <Radio.Group
          name={`radio-${field.id}`}
          defaultValue={defaultSelection}
          options={getRadioOptions()}
          optionType="default"
          buttonStyle="outline"
          style={getStyle()}
          className={layout === "horizontal" ? "flex flex-wrap gap-4" : ""}
        />

        {/* Layout info */}
        <div className="text-xs text-gray-500 mt-1">
          Layout: {layout} • {options.length} options
          {defaultSelection && ` • Default: ${defaultSelection}`}
        </div>
      </div>
    </BaseField>
  );
}
