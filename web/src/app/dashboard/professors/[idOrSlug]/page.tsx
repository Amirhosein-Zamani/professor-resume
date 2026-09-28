import ProfessorDetail from "./ProfessorDetail";

type ProfessorDetailPageProps = {
    params: Promise<{ idOrSlug: string }>;
};

export default async function ProfessorDetailPage({
    params,
}: ProfessorDetailPageProps) {
    const param = await params;
    return <ProfessorDetail idOrSlug={param.idOrSlug} />;
}
