import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons are used for the button
import { Product } from '../types/types';
import { useDispatch } from 'react-redux';
import { addProductId } from '../slices/products';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { LIKE_PRODUCT } from '../gql/mutations';

const RenderProductItem = ({ item }: { item: Product }) => {
  const [likeProduct, { }] = useMutation(LIKE_PRODUCT);

  const dispatch = useDispatch(); // This is a valid hook call now
  const imageUrl =
    item?.photos?.[0]?.url ||
    'https://www.wakavaping.com/cdn/shop/articles/FA4500_00dfc401-4349-42c5-8218-20916bcd1a29_1000x.png';
  const price = item?.price ; // Default to 'N/A' if no price is available
  const productName = item?.name || 'Unknown Product'; // Default to 'Unknown Product' if no name is available
  const navigation = useNavigation();

  const handleProduct = () => {
    // Ensure item.id is a valid number before dispatching
    const productId = item?.id ? parseInt(item.id.toString(), 10) : null;
    if (productId) {
      dispatch(addProductId(productId));
      router.push('/(auth)/product')
    }
  };

  return (
    <TouchableOpacity onPress={handleProduct} className="flex-1 p-2 max-w-[50%]">
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-40 bg-white"
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={1}>
            {productName}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-primary">{price} DH</Text>
            <TouchableOpacity onPress={handleProduct}  className="p-1">
              <Ionicons name="eye" size={28} color="#293777" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderProductItem;
