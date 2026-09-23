import EditProfessorForm from "./EditProfessorForm";

type EditProfessorPageProps = {
    params: Promise<{ idOrSlug: string }>;
};

export default async function EditProfessorPage({
    params,
}: EditProfessorPageProps) {
    const { idOrSlug } = await params;
    return <EditProfessorForm idOrSlug={idOrSlug} />;
}
