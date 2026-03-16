import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  roomId:    string
  userId:    string
  username:  string
  content:   string
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    roomId:   { type: String, required: true, index: true },
    userId:   { type: String, required: true },
    username: { type: String, required: true },
    content:  { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Message = mongoose.model<IMessage>('Message', MessageSchema)