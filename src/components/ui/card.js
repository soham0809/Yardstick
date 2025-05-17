import React from "react";

const Card = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = "", ...props }) => {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

const CardTitle = ({ children, className = "", ...props }) => {
    return (
        <h3 className={`text-xl font-bold text-gray-900 ${className}`} {...props}>
            {children}
        </h3>
    );
};

const CardDescription = ({ children, className = "", ...props }) => {
    return (
        <p className={`text-sm text-gray-500 ${className}`} {...props}>
            {children}
        </p>
    );
};

const CardContent = ({ children, className = "", ...props }) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

const CardFooter = ({ children, className = "", ...props }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`} {...props}>
            {children}
        </div>
    );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 