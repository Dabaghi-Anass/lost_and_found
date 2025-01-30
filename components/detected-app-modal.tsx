import { formAppNativeLink } from "@/lib/utils";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '~/components/ui/dialog';
import { AppButton } from "./AppButton";
type Props = {
  onClose: () => void;
  visible: boolean;
}
export function DetectedInstalledAppModal({ visible, onClose }: Props) {
  const handleOpenApp = useCallback(() => {
    const appLink = formAppNativeLink("/items")
    onClose()
    window.location.href = appLink;
  }, []);
  return <Dialog
    open={visible}
    onOpenChange={open => {
      if (!open) onClose();
    }}
  >
    <DialogContent className='sm:max-w-[425px]'>
      <DialogTitle>
        <Text className='text-foreground text-lg'>Detected Installed App</Text>
      </DialogTitle>
      <ScrollView className="w-full max-h-[70vh] bg-background flex justify-center items-center">
        <View className='p-4 rounded-lg'>
          <Text className='text-lg text-center text-foreground'>Please continue to the app for better experience</Text>
          <AppButton onPress={handleOpenApp} className='mt-4'>
            <Text className="text-foreground">
              Open App
            </Text>
          </AppButton>
          <AppButton variant="outline" onPress={onClose} className='mt-4'>
            <Text className="text-foreground">Continue in Web</Text>
          </AppButton>
          <AppButton variant="outline" onPress={() => {
            localStorage.setItem('hideDownloadAppModal', 'true');
            onClose();
          }} className='mt-4'>
            <Text className="text-foreground">Don't show again</Text>
          </AppButton>
        </View>
      </ScrollView>
    </DialogContent>
  </Dialog >
}