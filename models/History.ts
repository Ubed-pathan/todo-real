import mongoose, { Schema, models, model } from 'mongoose'

export interface IHistory {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  todoId: mongoose.Types.ObjectId
  type: 'created' | 'edited' | 'deleted' | 'completed' | 'reopened'
  timestamp: Date
}

const HistorySchema = new Schema<IHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  todoId: { type: Schema.Types.ObjectId, ref: 'Todo', index: true, required: true },
  type: { type: String, enum: ['created','edited','deleted','completed','reopened'], required: true },
  timestamp: { type: Date, default: Date.now },
})

HistorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret: any) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})

export const History = models.History || model<IHistory>('History', HistorySchema)
