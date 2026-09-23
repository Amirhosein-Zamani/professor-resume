"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import CvDropZone from "./CvDropZone";
import CvFilePreview from "./CvFilePreview";
import { CV_MAX_FILE_SIZE_BYTES } from "./cv-upload.utils";

type CvUploadInputProps = {
    file: File | null;
    onChange: (file: File | null) => void;
    existingCvUrl?: string | null;
    existingCvName?: string | null;
    existingCvSize?: number | null;
    label?: string;
    required?: boolean;
    error?: string | null;
    showErrorMessage?: boolean;
};

export default function CvUploadInput({
    file,
    onChange,
    existingCvUrl,
    existingCvName,
    existingCvSize,
    label = "فایل رزومه (CV)",
    required = false,
    error,
    showErrorMessage = true,
}: CvUploadInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const hasExistingFile = !file && Boolean(existingCvUrl);

    const selectFile = (selected: File | null) => {
        if (!selected) return;
        if (selected.type !== "application/pdf") {
            toast.error("لطفاً فقط فایل PDF انتخاب کنید.");
            onChange(null);
            return;
        }
        if (selected.size > CV_MAX_FILE_SIZE_BYTES) {
            toast.error(`حجم فایل نباید بیشتر از ${CV_MAX_FILE_SIZE_BYTES / 1024 / 1024} مگابایت باشد.`);
            onChange(null);
            return;
        }
        onChange(selected);
    };

    const clearFile = () => {
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-soft)]">
                {label}
                {required && <span aria-hidden="true" className="mr-1 text-red-500">*</span>}
            </label>
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                required={required}
                className="hidden"
                onChange={(event) => {
                    selectFile(event.target.files?.[0] ?? null);
                    event.target.value = "";
                }}
            />

            {!file && !hasExistingFile ? (
                <CvDropZone
                    isDragging={isDragging}
                    error={error}
                    onChoose={() => inputRef.current?.click()}
                    onDragChange={setIsDragging}
                    onDrop={selectFile}
                />
            ) : (
                <CvFilePreview
                    displayName={file?.name || existingCvName || "رزومهٔ فعلی"}
                    fileSize={file?.size || existingCvSize}
                    existingUrl={existingCvUrl}
                    isNewFile={Boolean(file)}
                    error={error}
                    onReplace={() => inputRef.current?.click()}
                    onRemove={clearFile}
                />
            )}

            {error && showErrorMessage && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
        </div>
    );
}
