import { FormData } from '@/app/declare-item/[option]';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';

export function ChooseItemTypeForm({ formData, onFormData }: { formData: FormData, onFormData: (key: keyof FormData, data: any) => void }) {
  return <View className="py-8">
    <Text className="font-bold mb-8 text-muted-foreground text-2xl">
      What would you like to report?
    </Text>

    <View className='gap-4'>
      <TouchableNativeFeedback onPress={() => onFormData('type', 'lost')}>
        <View className='flex-row gap-4 items-center'>
          <Checkbox
            checkSize={30}
            style={{
              width: 40,
              height: 40,
            }}
            checked={formData.type === "lost"} onCheckedChange={(checked) => {
              if (checked) {
                onFormData('type', 'lost');
              } else {
                onFormData('type', 'found');
              }
            }} />
          <Text className="font-semibold text-3xl text-foreground font-secondary">Lost Item</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => onFormData('type', 'found')}>
        <View className='flex-row gap-4 items-center'>
          <Checkbox
            checkSize={30}
            style={{
              width: 40,
              height: 40,
            }}
            checked={formData.type === "found"} onCheckedChange={(checked) => {
              if (checked) {
                onFormData('type', 'found');
              } else {
                onFormData('type', 'lost');
              }
            }} />
          <Text className="font-semibold text-3xl text-foreground font-secondary">Found Item</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  </View>
}