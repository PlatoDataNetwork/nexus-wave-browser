
// This file re-exports toast components from hooks/use-toast

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement,
  useToast,
} from "@/hooks/use-toast";

export {
  useToast,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement
};

// Re-export the toast function directly
export const toast = useToast;
