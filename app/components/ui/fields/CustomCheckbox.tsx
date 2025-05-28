import { forwardRef } from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      required,
      disabled,
      className = "",
      id,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          id={id}
          className="sr-only peer"
        />
        <div
          className={`
            w-4 h-4 rounded border-2 transition-all duration-200 cursor-pointer
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
            border-gray-300 bg-white
             peer-checked:border-blue-600
            peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-1
            dark:border-gray-600 dark:bg-gray-700
            dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500
            dark:peer-focus:ring-blue-400 dark:peer-focus:ring-offset-gray-800
            hover:border-blue-400 dark:hover:border-blue-400
          `}
        >
          <Check
            className={`
              w-3 h-3 text-white absolute top-0 left-0 transition-opacity duration-200
              ${checked || defaultChecked ? "opacity-100" : "opacity-0"}
              peer-checked:opacity-100
            `}
            strokeWidth={3}
          />
        </div>
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";

export default CustomCheckbox;
