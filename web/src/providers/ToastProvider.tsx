"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={4}
            containerStyle={{
                top: "max(20px, env(safe-area-inset-top))",
                left: "50%",
                right: "auto",
                width: "min(92vw, 460px)",
                transform: "translateX(-50%)",
            }}
            
            toastOptions={{
                duration: 3500,

                style: {
                    background: "var(--color-card-bg)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    width: "100%",
                    maxWidth: "460px",
                    boxShadow:
                        "0 10px 25px rgba(18,26,24,.12)",
                },

                success: {
                    iconTheme: {
                        primary: "var(--color-success)",
                        secondary: "white",
                    },
                },

                error: {
                    iconTheme: {
                        primary: "var(--color-danger)",
                        secondary: "white",
                    },
                },

                loading: {
                    iconTheme: {
                        primary: "var(--color-base-jade-5)",
                        secondary: "white",
                    },
                },
            }}
        />
    );
}
