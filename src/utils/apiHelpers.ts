
import { toast } from "@/hooks/useToast";
import { API_ERROR_MESSAGE } from "@/config/apiKeys";

/**
 * Handles API errors with consistent error handling
 */
export const handleApiError = (error: unknown, customMessage?: string): void => {
  console.error("API error:", error);
  
  toast({
    title: "Error",
    description: customMessage || API_ERROR_MESSAGE,
    variant: "destructive"
  });
};

/**
 * Type-safe function to check if an object is an Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

/**
 * Returns a formatted string for a safe display of API error details
 */
export function formatApiErrorMessage(error: unknown): string {
  if (isError(error)) {
    return `Error: ${error.message}`;
  } else if (typeof error === "string") {
    return error;
  } else {
    return API_ERROR_MESSAGE;
  }
}
