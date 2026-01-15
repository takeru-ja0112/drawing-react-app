const HISTORY_KEY = 'drawing_app_history_rooms';

export default function historyLocalRoom() {
    // 直近でアクセスしてたルームのIDをローカルに保存する
    const setLocalRoom = (roomId: string) => {
        localStorage.removeItem(HISTORY_KEY);
        localStorage.setItem(HISTORY_KEY, roomId);
    }

    const getLocalRoom = (): string | null => {
        const localRoom = localStorage.getItem(HISTORY_KEY);
        if (!localRoom) {
            return null;
        }

        return localRoom;
    }


    return {
        setLocalRoom,
        getLocalRoom,
    }
}