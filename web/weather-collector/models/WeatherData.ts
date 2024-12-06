import mongoose from 'mongoose'

const weatherDataSchema = new mongoose.Schema(
  {
    value: Number,
    timestamp: Date,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const TemperatureIn = mongoose.model('TemperatureIn', weatherDataSchema)
export const TemperatureOut = mongoose.model('TemperatureOut', weatherDataSchema)
export const Humidity = mongoose.model('Humidity', weatherDataSchema)
export const Pressure = mongoose.model('Pressure', weatherDataSchema)
