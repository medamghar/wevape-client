import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  StatusBar,
  ScrollView
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql, useLazyQuery } from '@apollo/client';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { GET_PRODUCT_BY_ID } from '../gql/queries';
import { updateCart } from '../slices/products';
import Header from '../components/productHeader';

// Define types
type Variant = {
  id: string;
  name: string;
  photo: string;
  quantityInStock: number;
};

type CartItem = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalPrice: number;
  price: number;
  variants: { id: string; name: string; quantity: number }[];
};

type Photos = {
  id: number;
  url: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  photos: Photos[];
  price: number;
  variants: Variant[];
};

const ProductDetails: React.FC = () => {
  const productId = useSelector((state: RootState) => state.products.product_id);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentProductCart, setCurrentProductCart] = useState<CartItem | null>(null);
  const [getProductById, { data, loading, error }] = useLazyQuery(GET_PRODUCT_BY_ID);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Reset state when productId changes or component loses focus
  useFocusEffect(
    React.useCallback(() => {
      if (productId) {
        getProductById({ variables: { productId } });
        loadProductCart(productId.toString()); // Load cart data for this specific product
      }

      // Cleanup function to reset state when navigating away
      return () => {
        setCurrentProductCart(null);
      };
    }, [productId])
  );

  useEffect(() => {
    if (data) {
      setProduct(data.getProductById || null);
    }
  }, [data]);

  // Load cart data for the specific product
  const loadProductCart = async (productId: string) => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        const fullCart: CartItem[] = JSON.parse(storedCart);
        const productCart = fullCart.find(item => item.productId === productId);
        setCurrentProductCart(productCart || null);
      } else {
        setCurrentProductCart(null);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCurrentProductCart(null);
    }
  };

  const updateTotals = async (fullCart: CartItem[]) => {
    try {
      const totalAmount = fullCart.reduce((total, item) => total + item.totalPrice, 0);
      const totalQuantity = fullCart.reduce((total, item) => total + item.totalQuantity, 0);
      
      await AsyncStorage.setItem('totalAmount', totalAmount.toString());
      await AsyncStorage.setItem('totalQuantity', totalQuantity.toString());
      
      // Update the cart counter in Redux store immediately
      dispatch(updateCart(fullCart.length));
    } catch (error) {
      console.error('Failed to update totals:', error);
    }
  };

  const saveCart = async (updatedProductCart: CartItem | null) => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      let fullCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      if (updatedProductCart) {
        // Update or add the current product's cart data
        const existingIndex = fullCart.findIndex(item => item.productId === updatedProductCart.productId);
        if (existingIndex !== -1) {
          fullCart[existingIndex] = updatedProductCart;
        } else {
          fullCart.push(updatedProductCart);
        }
      } else {
        // Remove the product from cart if no quantities
        fullCart = fullCart.filter(item => item.productId !== productId.toString());
      }

      await AsyncStorage.setItem('cart', JSON.stringify(fullCart));
      
      // Update cart count and totals immediately
      updateTotals(fullCart);
      
      setCurrentProductCart(updatedProductCart);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const handleQuantityChange = (productId: string, variantId: string, value: number) => {
    if (!product) return;

    let updatedCart: CartItem | null = currentProductCart ? { ...currentProductCart } : {
      productId,
      productName: product.name,
      totalQuantity: 0,
      totalPrice: 0,
      price: product.price,
      variants: []
    };

    const variantIndex = updatedCart.variants.findIndex(v => v.id === variantId);
    
    if (variantIndex !== -1) {
      const newQuantity = Math.max(0, updatedCart.variants[variantIndex].quantity + value);
      if (newQuantity === 0) {
        updatedCart.variants = updatedCart.variants.filter(v => v.id !== variantId);
      } else {
        updatedCart.variants[variantIndex].quantity = newQuantity;
      }
    } else if (value > 0) {
      updatedCart.variants.push({
        id: variantId,
        name: product.variants.find(v => v.id === variantId)?.name || '',
        quantity: value
      });
    }

    // Update totals
    updatedCart.totalQuantity = updatedCart.variants.reduce((acc, variant) => acc + variant.quantity, 0);
    updatedCart.totalPrice = updatedCart.totalQuantity * product.price;

    // If no variants with quantity, set cart to null
    if (updatedCart.variants.length === 0) {
      updatedCart = null;
    }

    saveCart(updatedCart);
  };

  const calculateTotal = () => {
    return currentProductCart?.totalPrice || 0;
  };

  const handleAddToCart = async () => {
    if (!currentProductCart) return;
    
    try {
      // Cart data is already saved, just need to show confirmation
      Alert.alert('Success', 'Item added to cart successfully!');
      
      // Optionally navigate to cart or another screen
      // navigation.navigate('Cart');
    } catch (error) {
      console.error('Failed to process cart action:', error);
    }
  };

  if (!product || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <Header/>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative h-80">
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={product?.photos}
            keyExtractor={(item) => item.id.toString()}
            onScroll={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const currentIndex = Math.round(contentOffsetX / Dimensions.get('window').width);
              setActivePhotoIndex(currentIndex);
            }}
            renderItem={({ item }) => (
              <Image
                key={item.id}
                source={{ uri: item.url }}
                className="w-full h-80 bg-gray-50"
                style={{ width: Dimensions.get('window').width }}
                resizeMode="contain"
              />
            )}
          />
          
          {/* Pagination dots */}
          {product.photos.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
              {product.photos.map((_, index) => (
                <View 
                  key={index} 
                  className={`h-2 w-2 mx-1 rounded-full ${index === activePhotoIndex ? 'bg-blue-500 w-2.5 h-2.5' : 'bg-gray-300'}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">{product.name}</Text>
          <Text className="text-xl font-bold text-blue-500 mb-3">{product.price} DH</Text>
          
         
          
          <Text className="text-base text-gray-600 leading-6 mb-6">{product.description}</Text>
          
          {/* Variants Section */}
          <Text className="text-xl font-bold text-gray-800 mb-4">Variants</Text>
          {product.variants.map((item) => {
            const quantity = currentProductCart?.variants.find(v => v.id === item.id)?.quantity || 0;
            return (
              <View 
                key={item.id} 
                className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-3 shadow-sm"
              >
                <Image 
                  source={{ uri: item?.photo }} 
                  className="w-16 h-16 rounded-lg bg-white" 
                  resizeMode="contain" 
                />
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-gray-800 mb-1">{item.name}</Text>
                  {item.quantityInStock > 0 ? (
                    <Text className="text-sm text-green-500">In Stock</Text>
                  ) : (
                    <Text className="text-sm text-red-500">Out of Stock</Text>
                  )}
                </View>
                {item.quantityInStock === 0 ? (
                  <TouchableOpacity className="px-3 py-2 bg-gray-100 rounded-lg">
                    <Text className="text-sm font-medium text-gray-600">Notify Me</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-row items-center">
                    <TouchableOpacity 
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${quantity > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}
                      onPress={() => handleQuantityChange(product.id, item.id, -1)}
                    >
                      <Feather name="minus" size={20} color={quantity > 0 ? "#FFFFFF" : "#9CA3AF"} />
                    </TouchableOpacity>
                    <Text className="w-8 text-center text-base font-semibold text-gray-800">
                      {quantity}
                    </Text>
                    <TouchableOpacity 
                      className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center"
                      onPress={() => handleQuantityChange(product.id, item.id, 1)}
                    >
                      <Feather name="plus" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
          
          {/* Spacer for bottom cart bar */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Fixed Bottom Cart Bar */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-100 shadow-lg">
        <View>
          <Text className="text-sm text-gray-500 mb-1">Total</Text>
          <Text className="text-xl font-bold text-gray-800">{calculateTotal().toFixed(2)} DH</Text>
        </View>
        <TouchableOpacity
          className={`flex-row items-center px-6 py-3.5 rounded-xl ${calculateTotal() === 0 ? 'bg-blue-300' : 'bg-blue-500'}`}
          disabled={calculateTotal() === 0}
          onPress={handleAddToCart}
        >
          <Feather name="shopping-bag" size={20} color="white" className="mr-2" />
          <Text className="text-base font-semibold text-white">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;