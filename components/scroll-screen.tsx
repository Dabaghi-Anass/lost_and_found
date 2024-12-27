import { cn } from '@/lib/utils';
import { ScrollView, ScrollViewProps } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function ScrollScreen({ children, className, ...rest }: React.PropsWithChildren<ScrollViewProps>) {
  return (
    <SafeAreaProvider className='w-full h-full'>
      <SafeAreaView className='h-full w-full bg-background'>
        <ScrollView contentContainerClassName={cn("h-full w-full", className)} {...rest}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
