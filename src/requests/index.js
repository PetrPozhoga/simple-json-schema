import schema from './schema'

export const asyncGetSchema = () => {
  return new Promise((resolve => {
    setTimeout(() => {
      resolve({ data: schema, status: 200 })
    }, 300)
  }))
}