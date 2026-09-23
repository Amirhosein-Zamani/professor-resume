import type { Faculty } from "@/types/faculty";

export type FacultyItemActions = {
    editingName: string;
    editingIconFile: File | null;
    submitting: boolean;
    onEdit: (faculty: Faculty) => void;
    onDelete: (faculty: Faculty) => void;
    onEditName: (value: string) => void;
    onEditIcon: (file: File | null) => void;
    onUpdate: () => void;
    onCancelEdit: () => void;
};

export type FacultyTableProps = FacultyItemActions & {
    faculties: Faculty[];
    loading: boolean;
    search: string;
    editingId: string | null;
};

export type FacultyRowProps = FacultyItemActions & {
    faculty: Faculty;
    index: number;
    isEditing: boolean;
};
