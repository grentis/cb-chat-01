export default interface WSMessage {
    message: string;
    author_name: string;
    author_uid: string;
    created_at: Date;
    type: string;
}