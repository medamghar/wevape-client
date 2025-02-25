import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useAuth } from '../auth';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addCollectionId } from '../slices/products';
import { GET_COLLECTIONS_QUERY, GET_TOP } from '../gql/queries';
import ServiceList from '../components/collectionsService';
import RenderProductItem from '../components/products';
import Brands from './brands';
import { useNotifications } from '../NotificationsProvider';
import ImageSlider from '../components/slider';
import { CartItem } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingProfile = () => {
  const { loading, error, data, refetch } = useQuery(GET_TOP, {
    fetchPolicy: 'network-only',
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const collections = data?.getTop?.collections || [];
  const products = data?.getTop?.products || [];
  const marks = data?.getTop?.marks || [];
  
  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);
   const [cart, setCart] = useState<CartItem[]>([]);
   const fetchCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error retrieving cart data:', error);
    }
  }

  useEffect(() => {
    fetchCart();

  },[] );
  console.log(cart.length)
  const { notifications, markAsRead } = useNotifications();
  
  const count = notifications.filter((one) => one.isRead === false).length;
  
  const Header = () => (
    <View className="flex-row justify-between items-center px-6 py-3 border-b border-gray-200">
      <TouchableOpacity onPress={openDrawer}>
        <Entypo name="menu" color="#293777" size={30} className="text-primary" />
      </TouchableOpacity>
      <View className="flex-row gap-4 flex items-center">
        <TouchableOpacity onPress={() => router.push('/(auth)/products')}>
          <Ionicons color="#293777" name="search-outline" size={26} className="text-primary" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/(auth)/notifications')}>
          <View className="relative">
            <Ionicons color="#293777" name="notifications-outline" size={26} className="text-primary" />
            {count > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {count > 99 ? '99+' : count}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/cart')}>
          <View className="relative">
          <AntDesign name="shoppingcart" size={26} color="#293777" className='text-primary'/>
          {cart.length > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {cart.length > 99 ? '99+' : cart.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      
      </View>
    </View>
  );

  const SectionHeader = ({ title, route }:any) => (
    <View className="flex-row justify-between items-center px-4 mt-4 mb-4">
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      <TouchableOpacity onPress={() => router.push(route)} className="flex-row items-center flex justify-center gap-2">
        <Text className="text-base text-primary font-medium">Voir tous</Text>
        <AntDesign name="right" size={16} className="text-primary" />
      </TouchableOpacity>
    </View>
  );

  if (loading) return (
    <View className="flex-1 justify-center">
      <ActivityIndicator size="large" className="text-primary" />
    </View>
  );

  if (error) return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500 text-lg font-medium">Error loading data</Text>
      <Text className="text-gray-500">{error.message}</Text>
    </View>
  );
  
  const images = [
    "https://www.vozol.com/uploads/images/lKEyd8lVD0uak5VihfPedWJPI1lWaTiT1JXFE6A0.jpg",
    "https://cdn.shopify.com/s/files/1/0088/5997/5761/files/waka_somatch_mb6000_banner.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/fs/c51683192299257.65d92c3d860a9.jpg",
  ];
  
  const renderItem = ({ item }:any) => {
    return <RenderProductItem item={item} />;
  };

  // Create a component for the entire content
  const HomeContent = () => (
    <>
      
      <View>
        <SectionHeader title="Top Collection" route='/(auth)/collections' />
        <ServiceList name="collections" services={collections} />
        <SectionHeader title="Top Marks" route='/(auth)/brands' />
        <ServiceList name="brands" services={marks} />
        <SectionHeader title="Featured Products" route='/(auth)/products' />
        <View className="px-4">
          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              scrollEnabled={false} // Disable scrolling for nested FlatList
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          ) : (
            <Text className="text-center py-4 text-gray-500">No products available</Text>
          )}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <View className="mb-4">
        <ImageSlider images={images} />
      </View>
      <FlatList
        data={[{ key: 'content' }]} // Single item to render the HomeContent
        renderItem={() => <HomeContent />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#293777']} // Match your primary color
            tintColor="#293777"
          />
        }
      />
    </SafeAreaView>
  );
};

export default LoadingProfile;