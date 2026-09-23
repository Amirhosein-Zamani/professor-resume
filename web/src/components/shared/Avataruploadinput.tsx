"use client";

import { useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { toAvatarSrc } from "@/lib/Avatar";

type AvatarUploadInputProps = {
    value: string; 
    onChange: (base64: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
    showErrorMessage?: boolean;
};

const MAX_FILE_SIZE_MB = 5;

function fileToPlainBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1] ?? "";
            resolve(base64);
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export default function AvatarUploadInput({
    value,
    onChange,
    label,
    required = false,
    error,
    showErrorMessage = true,
}: AvatarUploadInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const previewSrc = toAvatarSrc(value);

    const processFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("لطفاً فقط فایل تصویری انتخاب کنید.");
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error(`حجم عکس نباید بیشتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`);
            return;
        }

        setIsProcessing(true);

        try {
            const base64 = await fileToPlainBase64(file);
            onChange(base64);
            toast.success("تصویر با موفقیت آپلود شد");
        } catch {
            toast.error("خطا در پردازش تصویر.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        await processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        await processFile(file);
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            {label && (
                <p className="text-sm font-medium text-[var(--color-text-soft)]">
                    {label}
                    {required && <span aria-hidden="true" className="mr-1 text-red-500">*</span>}
                </p>
            )}
            <div className="flex flex-col items-start gap-4 min-[420px]:flex-row min-[420px]:items-center">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        flex h-20 w-20 shrink-0 cursor-pointer items-center
                        justify-center overflow-hidden rounded-full
                        border-2 bg-[var(--color-base-jade-1)]
                        transition-all duration-200
                        ${error
                            ? "border-[var(--color-danger)]"
                            : isDragging
                                ? "border-[var(--color-base-jade-4)] scale-105"
                                : "border-[var(--color-border)] hover:border-[var(--color-base-jade-4)]"
                        }
                        ${isProcessing ? "opacity-50" : ""}
                    `}
                >
                    {previewSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewSrc}
                            alt="پیش‌نمایش آواتار"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <FiUpload
                            size={22}
                            className={`text-[var(--color-base-jade-4)] ${
                                isDragging ? "scale-110" : ""
                            }`}
                        />
                    )}
                </div>

                <div className="flex w-full flex-col gap-2 min-[420px]:w-auto">
                    <div className="grid grid-cols-2 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            className="
                                cursor-pointer rounded-lg
                                border border-[var(--color-border)]
                                px-4 py-2 text-sm font-medium
                                text-[var(--color-text)]
                                transition-colors
                                hover:border-[var(--color-base-jade-4)]
                                hover:text-[var(--color-base-jade-5)]
                                disabled:cursor-not-allowed disabled:opacity-50
                            "
                        >
                            {isProcessing
                                ? "در حال پردازش..."
                                : previewSrc
                                  ? "تغییر عکس"
                                  : "انتخاب عکس"}
                        </button>

                        {previewSrc && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={isProcessing}
                                className="
                                    flex cursor-pointer items-center gap-1
                                    rounded-lg border border-[var(--color-border)]
                                    px-3 py-2 text-sm
                                    text-[var(--color-danger)]
                                    transition-colors
                                    hover:bg-[var(--color-danger)]/10
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <FiX size={14} />
                                <span>حذف</span>
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-[var(--color-text-muted)]">
                        فرمت JPG یا PNG، حداکثر {MAX_FILE_SIZE_MB} مگابایت. 
                        <span className="hidden sm:inline"> یا فایل را بکشید و رها کنید.</span>
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    required={required}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
            {error && showErrorMessage && (
                <p className="text-xs text-[var(--color-danger)]">{error}</p>
            )}
        </div>
    );
}
