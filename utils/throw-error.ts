export const throwError = (message: string, name: string) => {
    const error = new Error(message)
    error.name = name
    throw error
}