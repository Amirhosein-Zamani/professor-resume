const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--color-base-jade-4)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--color-text-soft)]";

type ProfileEditorProps = {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    isSaving: boolean;
    error: string | null;
    onEmailChange: (value: string) => void;
    onCurrentPasswordChange: (value: string) => void;
    onNewPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onCancel: () => void;
    onSave: () => void;
};

export default function ProfileEditor(props: ProfileEditorProps) {
    return (
        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className={labelClass}>ایمیل</label>
                    <input className={inputClass} value={props.email} onChange={(event) => props.onEmailChange(event.target.value)} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                    <div className="my-2 h-px bg-[var(--color-border)]" />
                    <p className="mb-3 text-sm text-[var(--color-text-soft)]">تغییر رمز عبور (اختیاری)</p>
                </div>
                <PasswordField label="رمز عبور فعلی" value={props.currentPassword} onChange={props.onCurrentPasswordChange} />
                <PasswordField label="رمز عبور جدید" value={props.newPassword} onChange={props.onNewPasswordChange} />
                <PasswordField label="تکرار رمز عبور جدید" value={props.confirmPassword} onChange={props.onConfirmPasswordChange} />
            </div>
            {props.error && <div className="mt-4 rounded-lg bg-[var(--color-danger)]/10 px-4 py-2.5 text-sm text-[var(--color-danger)]">{props.error}</div>}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                <button type="button" onClick={props.onCancel} disabled={props.isSaving} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-black/[0.02] disabled:opacity-40">انصراف</button>
                <button type="button" onClick={props.onSave} disabled={props.isSaving} className="rounded-lg bg-[var(--color-button-primary)] px-5 py-2 text-sm font-medium text-[var(--color-button-primary-text)] transition hover:bg-[var(--color-button-primary-hover)] disabled:opacity-60">
                    {props.isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
            </div>
        </div>
    );
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input type="password" className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} dir="ltr" />
        </div>
    );
}
