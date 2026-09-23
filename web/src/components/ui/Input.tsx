"use client";

import { InputHTMLAttributes, useState } from "react";
import { IconType } from "react-icons";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelIcon?: IconType;

    wrapperClassName?: string;
    labelClassName?: string;

    error?: string;
    showErrorMessage?: boolean;
    hint?: string;

    direction?: "rtl" | "ltr";
}

const Input: React.FC<InputProps> = ({
    label,
    labelIcon: LabelIcon,
    className = "",
    wrapperClassName = "",
    labelClassName = "",
    type = "text",
    error,
    showErrorMessage = true,
    hint,
    direction = "rtl",
    id,
    required = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    const iconPosition =
        direction === "rtl" ? "right-3" : "left-3";

    const inputPadding =
        type === "password"
            ? direction === "rtl"
                ? "pr-11 pl-4"
                : "pl-11 pr-4"
            : "px-4";

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
                <input
                    id={id}
                    dir={direction}
                    type={inputType}
                    required={required}
                    aria-required={required}
                    className={`
                        c
                        w-full
                        h-11
                        rounded-xl
                        border
                        bg-bg-soft
                        ${inputPadding}
                        text-base sm:text-sm
                        text-text
                        placeholder:text-text-muted
                        transition-all
                        outline-none

                        ${
                            error
                                ? "border-2 border-[var(--color-danger)] focus:border-[var(--color-danger)]"
                                : "border-border focus:border-base-jade-4 focus:ring-1 focus:ring-base-jade-4"
                        }

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        ${className}
                    `}
                    {...props}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={`
                            absolute
                            ${iconPosition}
                            top-1/2
                            -translate-y-1/2
                            text-text-muted
                            transition-colors
                            hover:text-base-jade-5
                        `}
                        aria-label={
                            showPassword
                                ? "مخفی کردن رمز عبور"
                                : "نمایش رمز عبور"
                        }
                    >
                        {showPassword ? (
                            <FiEyeOff size={18} />
                        ) : (
                            <FiEye size={18} />
                        )}
                    </button>
                )}
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

export default Input;
