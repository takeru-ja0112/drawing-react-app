import { createContext, useContext, useState } from "react";

interface ModalContextType {
    open: (type: string) => void;
    close: () => void;
    modalType: string | null;
}

const ModalContext = createContext<ModalContextType>({
    open: () => { },
    close: () => { },
    modalType: null,
});

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const [modalType, setModalType] = useState<string | null>(null);
    const open = (type: string) => setModalType(type);
    const close = () => setModalType(null);

    return (
        <ModalContext.Provider value={{ open, close, modalType }}>
            {children}
        </ModalContext.Provider>
    );
};