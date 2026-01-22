export interface Room {
    id: string;
    status: string;
    current_theme: string | null;
    created_at: string;
    created_by_name: string | null;
    room_name: string | null;
};

export interface CreateRoom {
    username: string;
    roomName: string;
    level: string;
    genre: string;
}

export interface RoomSettingType {
    level: string;
    genre: string;
}