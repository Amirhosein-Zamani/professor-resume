import { FiDownload, FiFile, FiTrash2 } from "react-icons/fi";

import { formatFileSize, getFileNameFromUrl } from "./cv-upload.utils";

type CvFilePreviewProps = {
    displayName: string;
    fileSize?: number | null;
    existingUrl?: string | null;
    isNewFile: boolean;
    error?: string | null;
    onReplace: () => void;
    onRemove: () => void;
};

export default function CvFilePreview(props: CvFilePreviewProps) {
    return (
        <div aria-invalid={Boolean(props.error)} className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 ${props.error ? "border-2 border-[var(--color-danger)]" : "border border-[var(--color-border)]"}`}>
            <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-[var(--color-base-jade-1)] p-2"><FiFile size={18} className="text-[var(--color-base-jade-5)]" /></div>
                <div className="min-w-0">
                    <span className="block truncate text-sm text-[var(--color-text)]">{props.displayName}</span>
                    {props.fileSize ? <p className="text-xs text-[var(--color-text-muted)]">{formatFileSize(props.fileSize)}</p> : null}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                {!props.isNewFile && props.existingUrl && (
                    <a href={props.existingUrl} download={getFileNameFromUrl(props.existingUrl)} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-[var(--color-text-soft)] hover:bg-[var(--color-base-jade-1)]" aria-label="دانلود فایل"><FiDownload size={16} /></a>
                )}
                <button type="button" onClick={props.onReplace} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)] hover:border-[var(--color-base-jade-4)]">
                    {props.isNewFile ? "تغییر" : "جایگزینی"}
                </button>
                {props.isNewFile && (
                    <button type="button" onClick={props.onRemove} className="rounded-lg p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10" aria-label="حذف فایل"><FiTrash2 size={16} /></button>
                )}
            </div>
        </div>
    );
}
