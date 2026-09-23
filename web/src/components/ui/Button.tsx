// components/ui/Button.tsx

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { FiLoader } from "react-icons/fi";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles = `
    cursor-pointer
    rounded-md sm:rounded-lg
    font-medium text-sm
    flex items-center justify-center gap-1.5
    transition-all duration-200
    shadow-sm hover:shadow
    active:scale-[0.97]
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:pointer-events-none
  `;

  const variantStyles = {
    primary: `
      bg-[var(--color-button-primary)]
      text-[var(--color-button-primary-text)]
      hover:bg-[var(--color-button-primary-hover)]
    `,
    secondary: `
      bg-[var(--color-surface)]
      text-[var(--color-text)]
      border border-[var(--color-border)]
      hover:bg-[var(--color-surface-hover)]
    `,
    outline: `
      bg-transparent
      text-[var(--color-base-jade-4)]
      border-2 border-[var(--color-base-jade-4)]
      hover:bg-[var(--color-base-jade-4)]
      hover:text-white
    `,
    danger: `
      bg-red-500
      text-white
      hover:bg-red-600
    `,
    ghost: `
      bg-transparent
      text-[var(--color-text-soft)]
      hover:bg-[var(--color-surface-hover)]
      hover:text-[var(--color-text)]
    `,
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs sm:text-sm",
    md: "h-10 px-3 sm:h-11 sm:px-4",
    lg: "h-11 px-4 sm:h-12 sm:px-5",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyles}
        ${className}
      `.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <FiLoader className="animate-spin" /> : icon}
      {children}
    </button>
  );
};

export default Button;
