interface WSMessage {
  message: string
  author_name: string
  author_uid: string
  created_at: Date
  type: string
}

export default WSMessage;

export interface WSReceivedMessage {
  command: string
  room?: string
  username?: string
  message?: string
}
