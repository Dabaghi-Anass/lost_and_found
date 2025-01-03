import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ActivityIndicator, Pressable } from "react-native";
import { Button, buttonVariants } from "./ui/button";
import { Text } from "./ui/text";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

export function AppButton({ children, className, loading, ...props }: React.PropsWithChildren<ButtonProps>) {
  return <>
    <Button className={cn("flex-row gap-2", className)} {...props}>
      {loading &&
        <ActivityIndicator color="white" size={20} />
      }
      {typeof children == "string" ?
        <Text>
          {children}
        </Text> :
        children
      }
    </Button>
  </>
}