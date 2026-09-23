import { InfoItemProps } from "@/utils/types";

export function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div>
            <p className="text-sm text-text-muted">
                {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    )
}