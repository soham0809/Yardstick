import React from "react";

const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "medium",
    className = "",
    disabled = false,
    type = "button",
    ...props
}) => {
    const baseClasses = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
    };

    const sizeClasses = {
        small: "px-2.5 py-1.5 text-xs",
        medium: "px-4 py-2 text-sm",
        large: "px-6 py-3 text-base",
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button; 