const rawServer = import.meta.env.VITE_SERVER || import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";
export const server = rawServer.replace(/\/+$/, "");
