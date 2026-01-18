import { useEffect } from "react";

export const useBlocker = (blocker : () => void , when = true) => {
    useEffect(() => {
        if (!when) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            blocker();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [blocker, when]);
    
};