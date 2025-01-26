import React from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type BottomModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
const BottomModal = ({ visible, title, onClose, children }: BottomModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <Pressable onPress={onClose} className='flex-1'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} className='bg-card'>
            <Text className='text-foreground font-bold text-xl'>{title}</Text>
            <View style={{ padding: 20, alignItems: "center", justifyContent: 'center' }}>
              {children}
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get("window").height / 3,
  },
});

export default BottomModal;
