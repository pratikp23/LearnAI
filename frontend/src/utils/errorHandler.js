/**
 * Formats any technical, server, or library error into a professional,
 * human-readable, user-friendly message.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) return fallback;

  // 1. Firebase Auth specific codes
  if (error.code) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled before completion. Please try again.";
      case "auth/cancelled-popup-request":
        return "Sign-in was interrupted. Please try again.";
      case "auth/popup-blocked":
        return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      case "auth/unauthorized-domain":
        return "This website domain is not authorized in Firebase. Please add it to Authorized Domains in Firebase Console.";
      case "auth/network-request-failed":
        return "Network connection error during authentication. Please check your internet connection.";
      case "auth/user-disabled":
        return "This account has been temporarily disabled. Please contact support.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password. Please verify your credentials.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a few minutes before trying again.";
      default:
        break;
    }
  }

  // 2. Extract message from backend response if available
  const serverMsg = error.response?.data?.message || error.response?.data?.error;
  if (typeof serverMsg === "string" && serverMsg.trim()) {
    const raw = serverMsg.trim();
    
    // Check if the backend returned an internal technical error / stack trace
    const isTechnical = 
      raw.includes("MongooseError") ||
      raw.includes("MongoServerError") ||
      raw.includes("buffering timed out") ||
      raw.includes("duplicate key error") ||
      raw.includes("ECONNREFUSED") ||
      raw.includes("CastError") ||
      raw.includes("ValidationError") ||
      raw.includes("Error:") ||
      raw.startsWith("signUp Error") ||
      raw.startsWith("login Error") ||
      raw.startsWith("is auth error");

    if (isTechnical) {
      if (raw.toLowerCase().includes("duplicate key") || raw.toLowerCase().includes("already exist")) {
        return "An account with this email address already exists. Please log in instead.";
      }
      if (raw.toLowerCase().includes("buffering timed out") || raw.toLowerCase().includes("econnrefused")) {
        return "Our database service is temporarily busy. Please try again in a few moments.";
      }
      return "An unexpected server issue occurred. Please try again shortly.";
    }

    // Capitalize first letter and format cleanly
    let formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
    if (!/[.!?]$/.test(formatted)) {
      formatted += ".";
    }
    return formatted;
  }

  // 3. HTTP Status code fallbacks
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please verify your information and try again.";
      case 401:
        return "Your session has expired or authentication is required. Please log in.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource could not be found.";
      case 429:
        return "Too many requests. Please wait a moment before trying again.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "The server is temporarily experiencing issues. Please try again in a few moments.";
      default:
        break;
    }
  }

  // 4. Axios / Browser network errors
  if (error.message) {
    if (error.message.includes("Network Error") || error.code === "ERR_NETWORK") {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "The connection timed out. Please try again in a moment.";
    }
  }

  return fallback;
};
