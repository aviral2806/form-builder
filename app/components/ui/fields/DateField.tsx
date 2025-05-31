import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { Field } from "~/stores/formBuilder";

interface DateFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview";
}

export default function DateField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
}: DateFieldProps) {
  const [value, setValue] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const minDate = getOptionValue("minDate", "");
  const maxDate = getOptionValue("maxDate", "");
  const defaultValue = getOptionValue("defaultValue", "");
  const customDefaultDate = getOptionValue("customDefaultDate", "");

  useEffect(() => {
    if (defaultValue === "today") {
      setValue(dayjs().format("YYYY-MM-DD"));
    } else if (defaultValue === "custom" && customDefaultDate) {
      setValue(customDefaultDate);
    }
  }, [defaultValue, customDefaultDate]);

  const validateDate = (date: string | null) => {
    const validationErrors: string[] = [];

    if (field.required && !date) {
      validationErrors.push("This field is required");
    }

    if (date) {
      const selectedDate = dayjs(date);

      if (minDate && selectedDate.isBefore(dayjs(minDate))) {
        validationErrors.push(`Date must be after ${minDate}`);
      }

      if (maxDate && selectedDate.isAfter(dayjs(maxDate))) {
        validationErrors.push(`Date must be before ${maxDate}`);
      }
    }

    return validationErrors;
  };

  useEffect(() => {
    if (touched) {
      setErrors(validateDate(value));
    }
  }, [value, field.required, minDate, maxDate, touched]);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setValue(date ? date.format("YYYY-MM-DD") : null);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getLabelClasses = () => {
    return "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  };

  const getContainerClasses = () => {
    if (mode === "preview") {
      return "space-y-1";
    }
    return "";
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        onBlur={handleBlur}
        className={`w-full ${
          touched && errors.length > 0
            ? "border-red-500"
            : touched && errors.length === 0
            ? "border-green-500"
            : "border-gray-300"
        }`}
        disabledDate={(current) =>
          (minDate && current && current.isBefore(dayjs(minDate))) ||
          (maxDate && current && current.isAfter(dayjs(maxDate)))
        }
      />

      {/* Validation errors */}
      {touched && errors.length > 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* Success message */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
          Valid date selected
        </div>
      )}

      {/* Date constraints info (only in edit mode) */}
      {mode === "edit" && (
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          {minDate && <div>Minimum date: {minDate}</div>}
          {maxDate && <div>Maximum date: {maxDate}</div>}
          {defaultValue === "today" && <div>Defaults to today's date</div>}
          {defaultValue === "custom" && customDefaultDate && (
            <div>Defaults to: {customDefaultDate}</div>
          )}
        </div>
      )}
    </div>
  );

  if (mode === "preview") {
    return fieldContent;
  }

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      {fieldContent}
    </BaseField>
  );
}
