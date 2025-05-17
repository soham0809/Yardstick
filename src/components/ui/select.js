import React from "react";

const Select = React.forwardRef(({
    className = "",
    options = [],
    placeholder,
    error,
    ...props
}, ref) => {
    const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
    const errorClasses = error ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500" : "";

    return (
        <div className="w-full">
            <select
                className={`${baseClasses} ${errorClasses} ${className}`}
                ref={ref}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";

export default Select; 