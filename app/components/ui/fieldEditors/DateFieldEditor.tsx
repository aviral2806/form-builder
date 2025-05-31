import { Field, FieldOption } from "~/stores/formBuilder";
import { DatePicker, Select, Checkbox } from "antd";
import dayjs from "dayjs";

interface DateFieldEditorProps {
  field: Field;
  updateField: (updates: Partial<Field>) => void;
  updateOption: (key: string, value: any, type?: FieldOption["type"]) => void;
  getOptionValue: (key: string, defaultValue?: any) => any;
}

export default function DateFieldEditor({
  updateOption,
  getOptionValue,
}: DateFieldEditorProps) {
  const minDate = getOptionValue("minDate", "");
  const maxDate = getOptionValue("maxDate", "");
  const defaultValue = getOptionValue("defaultValue", "none");
  const disablePastDates = getOptionValue("disablePastDates", false);
  const disableFutureDates = getOptionValue("disableFutureDates", false);

  const handleMinDateChange = (date: dayjs.Dayjs | null) => {
    const newMinDate = date ? date.format("YYYY-MM-DD") : "";
    updateOption("minDate", newMinDate);
  };

  const handleMaxDateChange = (date: dayjs.Dayjs | null) => {
    const newMaxDate = date ? date.format("YYYY-MM-DD") : "";
    updateOption("maxDate", newMaxDate);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">
        Date Field Options
      </h3>

      {/* Date Restrictions */}
      {/* <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Date Restrictions
        </h4>

        <Checkbox
          checked={disablePastDates}
          onChange={(e) =>
            updateOption("disablePastDates", e.target.checked, "boolean")
          }
        >
          Disable past dates
        </Checkbox>

        <Checkbox
          checked={disableFutureDates}
          onChange={(e) =>
            updateOption("disableFutureDates", e.target.checked, "boolean")
          }
        >
          Disable future dates
        </Checkbox>
      </div> */}

      {/* Min Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Min Date</label>
        <DatePicker
          value={minDate ? dayjs(minDate) : null}
          onChange={handleMinDateChange}
          className="w-full"
          disabledDate={(current) =>
            maxDate && current && current.isAfter(dayjs(maxDate))
          }
        />
      </div>

      {/* Max Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Max Date</label>
        <DatePicker
          value={maxDate ? dayjs(maxDate) : null}
          onChange={handleMaxDateChange}
          className="w-full"
          disabledDate={(current) =>
            minDate && current && current.isBefore(dayjs(minDate))
          }
        />
      </div>

      {/* Default Value */}
      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <Select
          value={defaultValue}
          onChange={(value) => updateOption("defaultValue", value)}
          className="w-full"
        >
          <Select.Option value="none">No default</Select.Option>
          <Select.Option value="today">Today</Select.Option>
          <Select.Option value="custom">Custom date</Select.Option>
        </Select>
        {defaultValue === "custom" && (
          <div className="mt-2">
            <DatePicker
              value={
                getOptionValue("customDefaultDate", "")
                  ? dayjs(getOptionValue("customDefaultDate", ""))
                  : null
              }
              onChange={(date) =>
                updateOption(
                  "customDefaultDate",
                  date ? date.format("YYYY-MM-DD") : ""
                )
              }
              className="w-full"
              disabledDate={(current) =>
                (minDate && current && current.isBefore(dayjs(minDate))) ||
                (maxDate && current && current.isAfter(dayjs(maxDate))) ||
                (disablePastDates &&
                  current &&
                  current.isBefore(dayjs().startOf("day"))) ||
                (disableFutureDates &&
                  current &&
                  current.isAfter(dayjs().startOf("day")))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
