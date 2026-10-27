export const getErrorMessage = (error, defaultMessage = "Something went wrong. Please try again.") => {
    // 1. Use the backend's specific error message if provided
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    // 2. Handle common HTTP status codes with user-friendly messages
    if (error?.response?.status) {
        switch (error.response.status) {
            case 400:
                return "The information provided was invalid. Please check and try again.";
            case 401:
                return "Your session has expired. Please log in again.";
            case 403:
                return "You don't have permission to perform this action.";
            case 404:
                return "The requested item could not be found.";
            case 429:
                return "Too many attempts. Please wait a moment and try again.";
            case 500:
            case 502:
            case 503:
            case 504:
                return "We are experiencing server issues. Please try again later.";
            default:
                break;
        }
    }
    // 3. Catch generic network errors
    if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
        return "Unable to connect. Please check your internet connection.";
    }
    // 4. Fallback to default user-friendly message, avoid generic "Request failed with status code XXX"
    return defaultMessage;
};
