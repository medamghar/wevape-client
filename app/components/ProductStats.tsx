import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductStats: React.FC<{ stats: { rating: number; reviewCount: number; soldCount: number } }> = ({ stats }) => (
  <View className="flex-row items-center gap-2 mt-2">
    <View className="flex-row items-center">
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text className="ml-1 text-sm font-medium">{stats.rating}</Text>
    </View>
    <Text className="text-gray-400">•</Text>
    <Text className="text-sm text-gray-600">{stats.reviewCount}+ Reviews</Text>
    <Text className="text-gray-400">•</Text>
    <Text className="text-sm text-gray-600">{stats.soldCount}+ Sold</Text>
  </View>
);

export default ProductStats;
