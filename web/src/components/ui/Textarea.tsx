
"use client";

import { TextareaHTMLAttributes } from "react";
import { IconType } from "react-icons";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    labelIcon?: IconType;
    error?: string;
    showErrorMessage?: boolean;
    hint?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    direction?: "rtl" | "ltr";
}

const Textarea: React.FC<TextareaProps> = ({
    label,
    labelIcon: LabelIcon,
    className = "",
    wrapperClassName = "",
    labelClassName = "",
    error,
    showErrorMessage = true,
    hint,
    direction = "rtl",
    id,
    rows = 4,
    required = false,
    ...props
}) => {
    return (
        <div className={`space-y-2 ${wrapperClassName}`}>
            {label && (
                <label
                    htmlFor={id}
                    className={`
                        flex items-center gap-2
                        text-sm font-medium
                        text-text-soft
                        ${labelClassName}
                    `}
                >
                    {LabelIcon && <LabelIcon className="text-base" />}
                    {label}
                    {required && (
                        <span aria-hidden="true" className="text-red-500">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="relative">
                <textarea
                    id={id}
                    dir={direction}
                    rows={rows}
                    required={required}
                    aria-required={required}
                    className={`
                        w-full
                        min-h-[80px]
                        rounded-xl
                        border
                        bg-bg-soft
                        px-4
                        py-2.5
                        text-base sm:text-sm
                        text-text
                        placeholder:text-text-muted
                        transition-all
                        outline-none
                        resize-y

                        ${error
                            ? "border-2 border-[var(--color-danger)] focus:border-[var(--color-danger)]"
                            : "border-border focus:border-base-jade-4 focus:ring-1 focus:ring-base-jade-4"
                        }

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        ${className}
                    `}
                    {...props}
                />
            </div>

            {error ? (
                showErrorMessage && <p className="text-xs text-danger">{error}</p>
            ) : (
                hint && (
                    <p className="text-xs text-text-muted">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
};

export default Textarea;
