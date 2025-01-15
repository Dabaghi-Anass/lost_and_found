import React, { useState } from 'react';
import { Modal, Platform, View } from 'react-native';

import ColorPicker, { Panel5 } from 'reanimated-color-picker';
import { AppButton } from './AppButton';

type Props = {
  onChange: (color: string) => void;
  value?: string;
};
export default function AppColorPicker({ onChange, value }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(value || null);
  const onSelectColor = ({ hex }: { hex: string }) => {
    setSelectedColor(hex);
    onChange(hex);
  };

  return (
    <View className='flex-1'>
      <AppButton size="default" variant="default" onPress={() => setShowModal(true)} >pick color</AppButton>
      <Modal visible={showModal} animationType='slide'
        className='max-w-full max-h-full w-full'
      >
        <View className='flex-1 gap-4 items-center justify-center' style={{
          justifyContent: 'center',
          backgroundColor: selectedColor || "white",
          padding: 20,
        }}>
          <ColorPicker

            value={value || "white"} onComplete={onSelectColor}>
            <Panel5 style={Platform.select({
              web: {
                height: "50vh",
                aspectRatio: 1,
              },
              android: {
                height: "50vh",
                width: '100%',
              },
              default: {
                height: "50vh",
                width: '100%',
              }
            }) as any} />
          </ColorPicker>
          <AppButton
            style={{
              borderWidth: 2,
              borderColor: 'white',
            }}
            variant="primary" onPress={() => setShowModal(false)}>Ok</AppButton>
        </View>
      </Modal>
    </View>
  );
}
