import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-3 rounded-lg
          bg-white
          border-2 border-gray-200
          focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          transition-all duration-200
          placeholder-gray-400
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
