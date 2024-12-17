// Checks if we are on development mode, if yes, use localhost, if no, use relative path in production deployment
export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8001' : '/api'
export const WS_URL: string = import.meta.env.DEV
  ? 'ws://127.0.0.1:8002'
  : 'ws://iot-weather.us.to/notify'
