import mongoose, { Schema, models, model } from 'mongoose'

export interface IUser {
  _id: mongoose.Types.ObjectId
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret: any) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.password
  }
})

export const User = models.User || model<IUser>('User', UserSchema)
