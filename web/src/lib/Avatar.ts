function detectImageMime(base64: string): string {
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  // fallback منطقی‌ترین گزینه چون اکثر آواتارها jpeg/png هستند
  return "image/png";
}

export function toAvatarSrc(avatarBase64?: string | null): string | null {
  if (!avatarBase64) return null;
  if (
    avatarBase64.startsWith("/") ||
    avatarBase64.startsWith("http://") ||
    avatarBase64.startsWith("https://") ||
    avatarBase64.startsWith("data:")
  ) {
    return avatarBase64;
  }
  const mime = detectImageMime(avatarBase64);
  return `data:${mime};base64,${avatarBase64}`;
}


export function getAvatarSrc(avatar?: string | null): string {
    if (!avatar) return "/Images/npr.png";

    if (avatar.startsWith("/") || avatar.startsWith("http") || avatar.startsWith("data:")) {
        return avatar;
    }

    // فرض می‌کنیم webp هست — اگر مطمئن نیستی از jpeg هم میشه استفاده کرد
    return `data:image/webp;base64,${avatar}`;
}
