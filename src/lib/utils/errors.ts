export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public errors?: any[]
  ) {
    super(message)
    this.name = 'AppError'
  }

  static badRequest(message: string, code?: string, errors?: any[]) {
    return new AppError(400, message, code, errors)
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(401, message, 'UNAUTHORIZED')
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(403, message, 'FORBIDDEN')
  }

  static notFound(message: string = 'Not found') {
    return new AppError(404, message, 'NOT_FOUND')
  }

  static conflict(message: string) {
    return new AppError(409, message, 'CONFLICT')
  }

  static tooManyRequests(message: string = 'Too many requests') {
    return new AppError(429, message, 'RATE_LIMIT_EXCEEDED')
  }

  static internal(message: string = 'Internal server error') {
    return new AppError(500, message, 'INTERNAL_SERVER_ERROR')
  }
}
