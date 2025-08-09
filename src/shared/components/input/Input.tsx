import { forwardRef } from "react";
import { InputModel } from "../../models/Input.model";

const Input = forwardRef<HTMLInputElement, InputModel>(
  ({ label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            className="font-medium text-gray-700 text-sm"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          className="max-w-[355px] h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring- focus:border-bb-green"
        />
      </div>
    );
  }
);

export default Input;
