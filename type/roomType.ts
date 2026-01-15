export interface Room {
    id: string;
    status: string;
    current_theme: string | null;
    created_at: string;
    created_by_name: string | null;
    room_name: string | null;
};