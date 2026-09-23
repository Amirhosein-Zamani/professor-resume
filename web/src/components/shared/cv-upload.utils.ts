export const CV_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function formatFileSize(bytes?: number | null) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileNameFromUrl(url: string) {
    const parts = url.split("/");
    return parts[parts.length - 1] || "resume.pdf";
}
