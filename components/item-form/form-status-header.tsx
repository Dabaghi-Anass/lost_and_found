import React from 'react';
import { Text, View } from 'react-native';

export function FormStatusHeader({ step }: { step: number }) {
  return <View className="flex-row justify-between mb-6">
    {['Type', 'Details', 'Location', 'Images'].map((label, i) => (
      <View key={label} className="items-center">
        <View
          className={`h-8 w-8 rounded-full ${i + 1 <= step ? 'bg-emerald-500' : 'bg-gray-300 opacity-50'
            } items-center justify-center mb-1`}
        >
          <Text className="text-white font-bold">{i + 1}</Text>
        </View>
        <Text
          className={i + 1 <= step ? 'text-emerald-500' : 'text-gray-500'}
        >
          {label}
        </Text>
      </View>
    ))}
  </View>
}