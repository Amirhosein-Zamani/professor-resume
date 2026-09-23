import { FiUploadCloud } from "react-icons/fi";

import { CV_MAX_FILE_SIZE_BYTES } from "./cv-upload.utils";

type CvDropZoneProps = {
    isDragging: boolean;
    error?: string | null;
    onChoose: () => void;
    onDragChange: (dragging: boolean) => void;
    onDrop: (file: File | null) => void;
};

export default function CvDropZone({ isDragging, error, onChoose, onDragChange, onDrop }: CvDropZoneProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onChoose}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChoose();
                }
            }}
            onDragOver={(event) => {
                event.preventDefault();
                onDragChange(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                onDragChange(false);
            }}
            onDrop={(event) => {
                event.preventDefault();
                onDragChange(false);
                onDrop(event.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm text-[var(--color-text-soft)] transition ${
                error
                    ? "border-[var(--color-danger)]"
                    : isDragging
                      ? "border-[var(--color-base-jade-4)] bg-[var(--color-base-jade-1)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-base-jade-4)]"
            }`}
        >
            <FiUploadCloud size={32} className={isDragging ? "text-[var(--color-base-jade-5)]" : ""} />
            <div className="text-center">
                <p className="font-medium">{isDragging ? "فایل را رها کنید" : "برای آپلود کلیک کنید یا فایل را بکشید"}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">فرمت PDF، حداکثر {CV_MAX_FILE_SIZE_BYTES / 1024 / 1024} مگابایت</p>
            </div>
        </div>
    );
}
