import QrCode from "@/assets/images/qrcode.png";
import { Image, Text, View } from "react-native";
import {
  Dialog,
  DialogContent
} from '~/components/ui/dialog';
import { AppButton } from "./AppButton";
import Screen from "./screen";
type Props = {
  onClose: () => void;
  visible: boolean;
}
export function DownloadAppModal({ visible, onClose }: Props) {
  return <Dialog
    open={visible}
    onOpenChange={open => {
      if (!open) onClose();
    }}
  >
    <DialogContent className='sm:max-w-[425px]'>
      <Screen className='bg-background flex justify-center items-center'>
        <View className='p-4 rounded-lg'>
          <Text className='text-lg text-center text-foreground'>Please download the app for better experience</Text>
          <Image source={QrCode} className='w-40 h-40 max-w-52 max-h-52 mx-auto my-8' />
          <Text className='text-lg text-center text-foreground'>scan to download</Text>
          <Text className='text-lg text-center text-foreground'>OR</Text>
          <AppButton onPress={() => {
            const appLink = "https://expo.dev/artifacts/eas/d4TdFVfaQkzCoGe2Jcypon.apk";
            window.location.href = appLink;
            onClose()
          }} className='mt-4'>
            <Text className="text-foreground">
              Download Android App
            </Text>
          </AppButton>
          <AppButton variant="outline" onPress={onClose} className='mt-4'>
            <Text className="text-foreground">Continue in Web</Text>
          </AppButton>
        </View>
      </Screen>
    </DialogContent>
  </Dialog >
}