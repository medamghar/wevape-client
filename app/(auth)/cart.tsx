import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/productHeader';
import { gql, useMutation } from '@apollo/client';
import { updateCart } from '../slices/products';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';

// Define the mutation
const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      message
      ok
    }
  }
`;

type Variant = {
  id: string;
  name: string;
  quantity: number;
};

type CartItem = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalPrice: number;
  variants: Variant[];
  price: number;
};

interface CreateOrderLineInput {
  productId: number;
  variantId?: number;
  quantity: number;
}

interface CreateOrderInput {
  orderLines: CreateOrderLineInput[];
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCart(JSON.parse(cartData));
          dispatch(updateCart(JSON.parse(cartData).length));
        }
      } catch (error) {
        console.error('Error retrieving cart data:', error);
      }
    };

    fetchCart();
  }, []);

  const updateVariantQuantity = (productId: string, variantId: string, change: number) => {
    const updatedCart = cart.map((product) => {
      if (product.productId === productId) {
        const updatedVariants = product.variants.map((variant) => {
          if (variant.id === variantId) {
            const updatedQuantity = Math.max(0, variant.quantity + change);
            return { ...variant, quantity: updatedQuantity };
          }
          return variant;
        });

        const updatedTotalQuantity = updatedVariants.reduce((total, v) => total + v.quantity, 0);
        const updatedTotalPrice = product.price * updatedTotalQuantity;

        return {
          ...product,
          variants: updatedVariants,
          totalQuantity: updatedTotalQuantity,
          totalPrice: updatedTotalPrice,
        };
      }
      return product;
    });

    setCart(updatedCart);
    AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeProduct = (productId: string) => {
    Alert.alert('Remove Product', 'Are you sure you want to remove this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          const updatedCart = cart.filter((product) => product.productId !== productId);
          setCart(updatedCart);
          AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
          dispatch(updateCart(cart.length));
        },
      },
    ]);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, product) => total + product.totalPrice, 0);
  };

  const isCheckoutDisabled = () => {
    return cart.some(product => product.totalQuantity === 0 || product.totalPrice === 0);
  };

  const prepareOrderLines = (): CreateOrderInput => {
    const allOrderLines: CreateOrderLineInput[] = [];
    
    cart.forEach(product => {
      const productOrderLines = product.variants
        .filter(variant => variant.quantity > 0)
        .map(variant => ({
          productId: parseInt(product.productId, 10),
          variantId: parseInt(variant.id, 10),
          quantity: variant.quantity
        }));

      allOrderLines.push(...productOrderLines);
    });

    return {
      orderLines: allOrderLines
    };
  };

  const clearCart = async () => {
    try {
      dispatch(updateCart(0));
      await AsyncStorage.removeItem('cart');
      await AsyncStorage.removeItem('totalAmount');
      await AsyncStorage.removeItem('totalQuantity');
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleOrder = async () => {
    if (isCheckoutDisabled()) {
      Alert.alert('Cannot Checkout', 'Please remove products with zero quantity or total price from your cart.');
      return;
    }

    try {
      const orderInput = prepareOrderLines();
      
      const validationError = orderInput.orderLines.some(
        line => 
          typeof line.productId !== 'number' || 
          isNaN(line.productId) ||
          (line.variantId !== undefined && (typeof line.variantId !== 'number' || isNaN(line.variantId))) ||
          typeof line.quantity !== 'number' ||
          isNaN(line.quantity)
      );

      if (validationError) {
        throw new Error('Invalid ID format in order data');
      }
      const response = await createOrder({
        variables: {
          createOrderInput: orderInput
        }
      });

      if (response.data?.createOrder?.ok) {
        clearCart();
        router.push('/(auth)/order_place');
      } else {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Something went wrong while placing your order. Please try again.');
    }
  };

  const renderVariantItem = ({ item, productId }: { item: Variant; productId: string }) => (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
      <Text className="text-gray-800 font-medium">{item.name}</Text>
      <View className="flex-row items-center bg-gray-50 rounded-full px-2 py-1">
        <TouchableOpacity 
          className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
          onPress={() => updateVariantQuantity(productId, item.id, -1)}
        >
          <Ionicons name="remove-outline" size={18} color="#6366f1" />
        </TouchableOpacity>
        <Text className="mx-4 text-lg font-semibold text-gray-800">{item.quantity}</Text>
        <TouchableOpacity 
          className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
          onPress={() => updateVariantQuantity(productId, item.id, 1)}
        >
          <Ionicons name="add-outline" size={18} color="#6366f1" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="cart-outline" size={80} color="#d1d5db" />
          <Text className="text-2xl font-bold text-gray-800 mt-6">Your cart is empty</Text>
          <Text className="text-gray-500 text-center mt-2">Looks like you haven't added any products to your cart yet.</Text>
          <TouchableOpacity 
            className="mt-8 bg-indigo-500 px-6 py-3 rounded-lg" 
            onPress={() => router.push('/(auth)/products')}
          >
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header isCollection="Panier d'Achat" />
      <View className="flex-1 pb-24">
        <Text className="px-4 py-4 text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</Text>
        
        <FlatList
          data={cart}
          keyExtractor={(item) => item.productId}
          className="px-4"
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800 mb-1">{item.productName}</Text>
                  <Text className="text-indigo-600 font-bold">{item.totalPrice.toFixed(2)} dh</Text>
                </View>
                <TouchableOpacity 
                  className="p-2" 
                  onPress={() => removeProduct(item.productId)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
              
              <View className="bg-gray-50 rounded-lg p-3 mb-2">
                <Text className="text-gray-500 mb-2">Variantes</Text>
                <FlatList
                  data={item.variants}
                  keyExtractor={(variant) => variant.id}
                  scrollEnabled={false}
                  renderItem={({ item: variant }) => renderVariantItem({ item: variant, productId: item.productId })}
                />
              </View>
            </View>
          )}
        />
      </View>
      
      {/* Bottom checkout panel */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-lg rounded-t-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500">Total</Text>
          <Text className="text-xl font-bold text-gray-800">{calculateCartTotal().toFixed(2)} DH</Text>
        </View>
        
        <TouchableOpacity
          className={`py-4 rounded-xl flex-row justify-center items-center ${
            isCheckoutDisabled() || orderLoading ? 'bg-gray-300' : 'bg-indigo-600'
          }`}
          onPress={handleOrder}
          disabled={isCheckoutDisabled() || orderLoading}
        >
          {orderLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-bold ml-2">Processing...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="shield-checkmark-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-lg">Passer la commande</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;