import { notFound } from "next/navigation";
import LoginForm from "./components/LoginForm";
import OtpForm from "./components/OtpForm";

interface Props {
    params: Promise<{
        action: string;
    }>;
}

export default async function AuthPage({ params }: Props) {
    const { action } = await params;
    switch (action) {
        case "login":
            return <LoginForm />;

        case "otp":
            return <OtpForm />;

        default:
            notFound();
    }
}