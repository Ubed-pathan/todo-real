import mongoose, { Schema, models, model } from 'mongoose'

export interface ISubTask {
  _id: mongoose.Types.ObjectId
  title: string
  completed: boolean
}

export interface ITodo {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  note?: string
  subtasks: ISubTask[]
  createdAt: Date
  completedAt?: Date | null
}

const SubTaskSchema = new Schema<ISubTask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

SubTaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: any, ret: any) => {
    ret.id = ret._id?.toString?.() || ret.id
    delete ret._id
  }
})

const TodoSchema = new Schema<ITodo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  note: { type: String },
  subtasks: { type: [SubTaskSchema], default: [] },
  completedAt: { type: Date, default: null },
}, { timestamps: { createdAt: true, updatedAt: true } })

TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret: any) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})

export const Todo = models.Todo || model<ITodo>('Todo', TodoSchema)
