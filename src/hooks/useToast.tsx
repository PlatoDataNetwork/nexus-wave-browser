
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/hooks/use-toast";

// Create a unified toast hook that decides which system to use
export const useUnifiedToast = () => {
  const shadcnToast = useShadcnToast();
  
  // Create a unified toast API that works with both systems
  const toast = (props: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
  }) => {
    // Use Sonner for most toasts (modern floating style)
    sonnerToast(props.title || "", {
      description: props.description,
      className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : 
                props.variant === "success" ? "bg-green-500 text-white" : undefined
    });
    
    // No need to call shadcn toast as well - we're standardizing on Sonner
  };
  
  return { toast };
};

// Export a standalone toast function too
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}) => {
  sonnerToast(props.title || "", {
    description: props.description,
    className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : 
              props.variant === "success" ? "bg-green-500 text-white" : undefined
  });
};
