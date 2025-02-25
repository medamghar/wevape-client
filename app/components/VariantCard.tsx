import React from 'react';

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Variant } from '../types/types';
import QuantitySelector from './QuantitySelector';

interface VariantCardProps {
  variant: Variant;

  onQuantityChange: (quantity: number) => void;
}

export const VariantCard: React.FC<VariantCardProps> = ({
  variant,
  onQuantityChange,
 
}) => (
  <View
    className={`mb-4 p-4 rounded-lg transition-all
     
      ${!variant.isAvailable ? 'opacity-50' : ''}
    `}
  >
    <TouchableOpacity
     
      className="w-full"
      disabled={!variant.isAvailable}
    >
      <View className="flex flex-row items-start">
        <Image
          source={{ uri: variant.image }}
          alt={variant.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-medium">{variant.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">
            {variant.itemsPerPack} vapes/pack
          </Text>
          <View className="flex flex-row items-center mt-1">
            <Text className="text-lg font-bold">
              ${variant.wholesalePrice.toFixed(2)}
            </Text>
            <Text className="text-sm text-gray-400 ml-2 line-through">
              ${variant.price.toFixed(2)}
            </Text>
          </View>
          <Text
            className={`text-sm mt-1 ${
              variant.isAvailable ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {variant.isAvailable
              ? `${variant.quantityAvailable} packs disponibles`
              : 'En rupture de stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    {variant.isAvailable && (
      <View className="mt-4">
        <QuantitySelector
          maxQuantity={variant.quantityAvailable}
          onQuantityChange={onQuantityChange}
        />
      </View>
    )}
  </View>
);
