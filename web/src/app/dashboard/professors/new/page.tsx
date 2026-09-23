import { Suspense } from "react";
import NewProfessorForm from "./NewProfessorForm";

export default function NewProfessorPage() {
    return (
        <Suspense fallback={null}>
            <NewProfessorForm />
        </Suspense>
    );
}
