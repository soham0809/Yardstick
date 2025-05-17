import React from "react";

const Input = React.forwardRef(({
    className = "",
    type = "text",
    error,
    ...props
}, ref) => {
    const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
    const errorClasses = error ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "";

    return (
        <div className="w-full">
            <input
                type={type}
                className={`${baseClasses} ${errorClasses} ${className}`}
                ref={ref}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input; 