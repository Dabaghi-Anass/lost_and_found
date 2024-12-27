import { VariantProps } from "class-variance-authority";
import { Pressable } from "react-native";
import { Button, buttonVariants } from "./ui/button";
import { Text } from "./ui/text";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

export function AppButton({ children, ...props }: React.PropsWithChildren<ButtonProps>) {
  return <>
    <Button {...props}>
      {typeof children == "string" ?
        <Text>
          {children}
        </Text> :
        children
      }
    </Button>
  </>
}