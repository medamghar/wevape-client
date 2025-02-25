import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { CartItem } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  isCollection?: string;
  iSearch?: boolean; // Now required
  searchText?: string; // Adding searchText prop
  setSearchText?: (text: string) => void; // Function to handle search text change
}

const Header: React.FC<HeaderProps> = ({ isCollection, iSearch, searchText, setSearchText }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
      } catch (error) {
        console.error('Error retrieving cart data:', error);
      }
    };

    fetchCart();
  }, );

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <TouchableOpacity
        onPress={() => router.back()}
        className="p-2"
      >
        <AntDesign name="left" size={20} color="#293777" />
      </TouchableOpacity>
      {isCollection && (
       
                <Text className="text-xl font-semibold text-gray-800">{isCollection || 'Collection'}
</Text>

      )}
      {iSearch && (
        <View className="flex-1 flex-row items-center mx-4 bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#888" className="mr-2" />
          <TextInput
            className="flex-1 text-base"
            placeholder="Search products..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}
      <TouchableOpacity className="p-2 relative" onPress={() => router.push('/(auth)/cart')}>
        <AntDesign name="shoppingcart" size={20} color="#293777" />
        <View className="bg-red-600 w-5 h-5 rounded-full flex items-center justify-center absolute top-0 right-0 translate-x-1 translate-y-1">
          <Text className="text-xs text-white font-semibold">{cart.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
