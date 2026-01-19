"use client";

import { motion } from 'motion/react';

export default function Modal({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white border border-dotted border-gray-300 border-4 rounded-3xl mx-6 p-6 max-w-lg relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        </>
    );

    // dialog要素のbackdropをクリックしたときの処理

    // const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    //     // dialog要素のクリックイベントで、backdropをクリックした場合
    //     // dialog内部については.modalContentInnerが覆っているのでevent.targetがdialog要素になることはない
    //     // つまりbackdropをクリックしたときのみevent.target === event.currentTargetとなる
    //     if (event.target === event.currentTarget) {
    //         setIsOpens(false);
    //     }
    // };


    // // モーダルアニメーションの定義
    // const modalVariants = {
    //     visible: {
    //         opacity: 1, // 不透明度: 1（完全に表示）
    //         scale: 1, // スケール: 1（元のサイズ）
    //         x: "-50%", // x位置: -50%（中央揃えのため）
    //         y: "-50%", // y位置: -50%（中央揃えのため）
    //     },
    //     hidden: {
    //         opacity: 0, // 不透明度: 0（透明）
    //         scale: 0.9, // スケール: 0.9（少し小さく）
    //         x: "-50%", // x位置: -50%（中央揃えのため）
    //         y: "-50%", // y位置: -50%（中央揃えのため）
    //     },
    // };

    // // オーバーレイ（背景）のアニメーション定義
    // const backdropVariants = {
    //     visible: { opacity: 1, visibility: "visible" },
    //     hidden: { opacity: 0, visibility: "hidden" },
    // };

    // return (
    //     <>
    //         <motion.div
    //             className="fixed inset-0 bg-white/50 flex items-center justify-center z-50"
    //             variants={backdropVariants}
    //             initial="hidden"
    //             animate={isOpens ? "visible" : "hidden"}
    //             transition={{ duration: 0.2 }}
    //         />
    //         <motion.dialog
    //             className="bg-white border border-dotted border-gray-300 border-4 rounded-3xl mx-6 p-6 max-w-lg relative"
    //             variants={modalVariants}
    //             animate={isOpens ? "visible" : "hidden"}
    //             transition={{ duration : 0.2}}
    //             ref={modalDialogRef}
    //             onAnimationComplete={handleAnimationComplete}
    //             onClick={handleBackdropClick}
    //             onCancel={event => handleClose(event)}
    //         >
    //             {children}
    //         </motion.dialog>
    //     </>
    // );
}