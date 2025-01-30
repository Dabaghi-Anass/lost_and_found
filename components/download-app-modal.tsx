import QrCode from "@/assets/images/qrcode.png";
import { useCallback } from "react";
import { Image, ScrollView, Text, View } from "react-native";
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
export function DownloadAppModal({ visible, onClose }: Props) {
  const handleDownloadApp = useCallback(() => {
    const appLink = "https://expo.dev/artifacts/eas/6YqxwwBFGxV9oktwMfJXuZ.apk";
    window.location.href = appLink;
    onClose()
  }, []);

  return <Dialog
    open={visible}
    onOpenChange={open => {
      if (!open) onClose();
    }}
  >
    <DialogContent className='sm:max-w-[425px]'>
      <DialogTitle>
        <Text className='text-foreground text-lg'>Download App</Text>
      </DialogTitle>
      <ScrollView className="w-full max-h-[70vh] bg-background flex justify-center items-center">
        <View className='p-4 rounded-lg'>
          <Text className='text-lg text-center text-foreground'>Please download the app for better experience</Text>
          <Image source={QrCode} className='w-40 h-40 max-w-52 max-h-52 mx-auto my-8' />
          <Text className='text-lg text-center text-foreground'>scan to download</Text>
          <Text className='text-lg text-center text-foreground'>OR</Text>
          <AppButton onPress={handleDownloadApp} className='mt-4'>
            <Text className="text-foreground">
              Download Android App
            </Text>
          </AppButton>
          <AppButton variant="outline" onPress={onClose} className='mt-4'>
            <Text className="text-foreground">Continue in Web</Text>
          </AppButton>
          <AppButton variant="outline" onPress={() => {
            onClose();
            localStorage.setItem('hideDownloadAppModal', 'true');
          }} className='mt-4'>
            <Text className="text-foreground">Don't show again</Text>
          </AppButton>
        </View>
      </ScrollView>
    </DialogContent>
  </Dialog >
}