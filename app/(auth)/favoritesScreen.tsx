import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from '@apollo/client';
import { GET_LIKEDPRODUCT_QUERY } from '../gql/queries';
import { ActivityIndicator } from 'react-native-paper';
import { setFavProductsCount } from '../slices/likedProducts';
import renderProductItem from '../components/products';
import RenderProductItem from '../components/products';
import Header from '../components/productHeader';

function FavoritesScreen() {
  const FavProductsCounter = useSelector((state: RootState) => state.prodctFavCounter.total);
  const dispatch = useDispatch();

  // Set up the useQuery with polling to refetch data every 10 seconds
  const { loading, error, data, refetch } = useQuery(GET_LIKEDPRODUCT_QUERY, {
    pollInterval: 10000, // refetch every 10 seconds
  });

  // Memoizing products list to prevent unnecessary renders
  const products = React.useMemo(() => data?.getLikedProducts ?? [], [data]);

  useEffect(() => {
    // Update favorite products count when products data changes
    dispatch(setFavProductsCount(products.length));
  }, [products, dispatch]);

  // Handle errors
  if (error) {
    return (
      <SafeAreaView className="flex items-center justify-center">
        <Text className="text-lg text-red-500">Error fetching products.</Text>
      </SafeAreaView>
    );
  }

  // Product item renderer


  return (
    <SafeAreaView className="flex">
      {/* Header */}
     <Header isCollection='Favorites'/>

      {/* Products count display (optional) */}
      <Text className="text-center py-2">{FavProductsCounter} products</Text>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={({ item }) => <RenderProductItem item={item} />}
        keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReachedThreshold={0}
        ListFooterComponent={loading ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#293777" />
          </View>
        ) : null}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default FavoritesScreen;
