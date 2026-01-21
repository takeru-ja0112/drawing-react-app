"use client";

import { ModalProvider } from "@/hooks/useModalContext";

export default function Layout(
    {
        children,
    }:
        Readonly<{ children: React.ReactNode; }>
) {

    return (
            <ModalProvider>
                {children}
            </ModalProvider>
    );
}