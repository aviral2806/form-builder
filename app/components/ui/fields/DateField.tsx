import { useState, useEffect } from "react";
import BaseField from "../BaseField";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { Field } from "~/stores/formBuilder";

interface DateFieldProps {
  field: Field;
  onEdit?: (fieldId: string) => void;
  onDelete?: (fieldId: string) => void;
  mode?: "edit" | "preview" | "submission";
  onValidation?: (isValid: boolean, errors: string[]) => void;
  onValueChange?: (value: any) => void;
  initialValue?: any;
}

export default function DateField({
  field,
  onEdit,
  onDelete,
  mode = "edit",
  onValidation,
  onValueChange,
  initialValue,
}: DateFieldProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const getOptionValue = (key: string, defaultValue: any = "") => {
    return field.options?.find((opt) => opt.key === key)?.value ?? defaultValue;
  };

  const dateFormat = getOptionValue("dateFormat", "MM/DD/YYYY");
  const minDate = getOptionValue("minDate", "");
  const maxDate = getOptionValue("maxDate", "");
  const disablePastDates = getOptionValue("disablePastDates", false);
  const disableFutureDates = getOptionValue("disableFutureDates", false);
  const defaultValue = getOptionValue("defaultValue", "none");
  const customDefaultDate = getOptionValue("customDefaultDate", "");

  useEffect(() => {
    let dateToSet: Dayjs | null = null;

    // Priority: initialValue > defaultValue settings
    if (initialValue) {
      const parsedDate = dayjs(initialValue);
      if (parsedDate.isValid()) {
        dateToSet = parsedDate;
      }
    } else {
      // Handle default value settings
      if (defaultValue === "today") {
        dateToSet = dayjs();
      } else if (defaultValue === "custom" && customDefaultDate) {
        const parsedCustomDate = dayjs(customDefaultDate);
        if (parsedCustomDate.isValid()) {
          dateToSet = parsedCustomDate;
        }
      }
    }

    setValue(dateToSet);
  }, [initialValue, defaultValue, customDefaultDate]);

  const validateDate = (selectedDate: Dayjs | null) => {
    const validationErrors: string[] = [];

    if (field.required && !selectedDate) {
      validationErrors.push("Date is required");
    }

    if (selectedDate && selectedDate.isValid()) {
      const today = dayjs().startOf("day");

      // Check past dates restriction
      if (disablePastDates && selectedDate.isBefore(today)) {
        validationErrors.push("Past dates are not allowed");
      }

      // Check future dates restriction
      if (disableFutureDates && selectedDate.isAfter(today)) {
        validationErrors.push("Future dates are not allowed");
      }

      // Check minimum date
      if (minDate) {
        const minDateObj = dayjs(minDate);
        if (minDateObj.isValid() && selectedDate.isBefore(minDateObj)) {
          validationErrors.push(
            `Date must be after ${minDateObj.format(dateFormat)}`
          );
        }
      }

      // Check maximum date
      if (maxDate) {
        const maxDateObj = dayjs(maxDate);
        if (maxDateObj.isValid() && selectedDate.isAfter(maxDateObj)) {
          validationErrors.push(
            `Date must be before ${maxDateObj.format(dateFormat)}`
          );
        }
      }
    }

    return validationErrors;
  };

  // Check if we're in interactive mode (preview or submission)
  const isInteractiveMode = mode === "preview" || mode === "submission";

  useEffect(() => {
    const validationErrors = validateDate(value);
    setErrors(validationErrors);

    // Call validation callback if in interactive mode
    if (isInteractiveMode && onValidation) {
      const isValid = validationErrors.length === 0;
      onValidation(isValid, validationErrors);
    }
  }, [value, field.required, minDate, maxDate, isInteractiveMode]);

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (!touched) {
      setTouched(true);
    }

    // Call value change callback if in interactive mode
    if (isInteractiveMode && onValueChange) {
      const dateString = newValue ? newValue.format("YYYY-MM-DD") : "";
      onValueChange(dateString);
    }
  };

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    const today = dayjs().startOf("day");

    // Disable past dates if required
    if (disablePastDates && current.isBefore(today)) {
      return true;
    }

    // Disable future dates if required
    if (disableFutureDates && current.isAfter(today)) {
      return true;
    }

    // Disable dates before minimum date
    if (minDate) {
      const minDateObj = dayjs(minDate);
      if (minDateObj.isValid() && current.isBefore(minDateObj)) {
        return true;
      }
    }

    // Disable dates after maximum date
    if (maxDate) {
      const maxDateObj = dayjs(maxDate);
      if (maxDateObj.isValid() && current.isAfter(maxDateObj)) {
        return true;
      }
    }

    return false;
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

  const getPickerClassName = () => {
    let baseClass = "w-full";

    if (touched && errors.length > 0) {
      return `${baseClass} border-red-500`;
    } else if (touched && errors.length === 0 && value) {
      return `${baseClass} border-green-500`;
    }

    return baseClass;
  };

  const fieldContent = (
    <div className={getContainerClasses()}>
      <label className={getLabelClasses()}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <DatePicker
        value={value}
        onChange={handleDateChange}
        format={dateFormat}
        className={getPickerClassName()}
        placeholder={field.placeholder || `Select date (${dateFormat})`}
        disabledDate={disabledDate}
        allowClear
      />

      {/* Date format hint */}
      <div className="text-xs text-gray-500 mt-1">
        Format: {dateFormat}
        {(disablePastDates || disableFutureDates || minDate || maxDate) && (
          <span className="ml-2">
            {disablePastDates && "• No past dates"}
            {disableFutureDates && "• No future dates"}
            {minDate && ` • After ${dayjs(minDate).format(dateFormat)}`}
            {maxDate && ` • Before ${dayjs(maxDate).format(dateFormat)}`}
          </span>
        )}
      </div>

      {/* Default value hint */}
      {!touched && value && (
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Default: {value.format(dateFormat)}
          {defaultValue === "today" && " (Today)"}
        </div>
      )}

      {/* Validation errors */}
      {touched && errors.length > 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {touched && errors.length === 0 && value && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1">
          <span className="text-green-500">✓</span>
          <span>Valid date selected</span>
        </div>
      )}
    </div>
  );

  if (isInteractiveMode) {
    return fieldContent;
  }

  return (
    <BaseField fieldId={field.id} onEdit={onEdit} onDelete={onDelete}>
      {fieldContent}
    </BaseField>
  );
}
