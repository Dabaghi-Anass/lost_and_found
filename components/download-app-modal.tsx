// import QrCode from "@/assets/images/qrcode.png";
import QRCode from 'qrcode';
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { Toast } from 'toastify-react-native';
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
  const canvasRef = useRef<HTMLCanvasElement | undefined>()
  const appLink = "https://expo.dev/artifacts/eas/wKHsqEdS9VTZidiFbqDAj4.apk";
  const handleDownloadApp = useCallback(() => {
    window.location.href = appLink;
    onClose()
  }, []);

  const generateQrCode = async () => {
    QRCode.toCanvas(canvasRef.current, appLink, function (error) {
      if (error) Toast.error('Failed to generate QR code');
    })
  }
  useEffect(() => {
    if (canvasRef.current) generateQrCode();
  }, [canvasRef])
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
      <ScrollView contentContainerClassName='flex justify-center items-center' className="w-full bg-background max-h-[80vh] flex justify-center items-center">
        <View className='rounded-lg p-4 h-full'>
          <Text className='text-lg text-center text-foreground'>Please download the app for better experience</Text>
          <canvas ref={canvasRef as any} width={500} height={500} className='my-1 mx-auto border-2 border-primary rounded-xl'></canvas>
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