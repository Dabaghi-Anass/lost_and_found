import { View } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
export function LoadingSpinner({ visible }: { visible: boolean }) {
  return (
    <View className="flex-1 justify-center items-center">
      <Spinner
        visible={visible}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF', fontSize: 25 }}
      />
    </View>
  );
}
