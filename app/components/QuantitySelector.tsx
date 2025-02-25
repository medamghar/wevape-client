import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuantitySelector: React.FC<{
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}> = ({  maxQuantity, onQuantityChange }) => {
const [quantity , setQuantity] =useState(1)
  return (
    <View className="w-full flex-row items-center justify-between border border-gray-200 rounded-lg">
      <TouchableOpacity
        onPress={() => setQuantity(quantity-1)}
        className={`p-3`}
      >
        <Ionicons name="remove" size={20} color="black" />
      </TouchableOpacity>
      <Text className="px-4 text-lg font-medium">{quantity}</Text>
      <TouchableOpacity
        onPress={() => setQuantity(quantity-1)}
        className={`p-3 `}
      >
        <Ionicons name="add" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
