"use client" // This indicates the component is client-side

import * as React from "react" // Import React library
import * as LabelPrimitive from "@radix-ui/react-label" // Import Label component from Radix UI

import { cva, type VariantProps } from "class-variance-authority" // Import class-variance-authority functions

import { cn } from "@/lib/utils" // Import a utility function for handling class names

// Define the base styles for the label component
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Create a Label component using forwardRef to pass refs down to the Radix Label component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // Define the ref type
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & // Define the props type
    VariantProps<typeof labelVariants> // Add variant props for labelVariants
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)} // Combine base styles and additional class names
    {...props} // Spread other props to the Radix Label component
  />
))

Label.displayName = LabelPrimitive.Root.displayName // Set display name for debugging

export { Label } // Export the Label component
