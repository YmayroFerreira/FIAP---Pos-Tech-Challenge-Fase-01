import { SelectModel } from "@/shared/models/Select.model";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Select = ({ options, defaultTextOption, ...props }: SelectModel) => {
  return (
    <div className="relative max-w-[355px] w-full">
      <select
        {...props}
        className="max-w-[355px] w-full h-12 px-4 pr-10 text-gray-800 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green appearance-none cursor-pointer"
        name="typeOfTransaction"
        required
      >
        <option value="" disabled>
          {defaultTextOption}
        </option>
        {options.map(({ option, value }) => (
          <option key={value} value={value}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default Select;
