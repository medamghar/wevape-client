import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { SafeAreaView, TextInput, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import debounce from 'lodash/debounce';
import Header from '../components/productHeader';
import { SEARCH_PRODUCTS } from '../gql/queries';
import RenderProductItem from '../components/products';

const ITEMS_PER_PAGE = 12;
const DEBOUNCE_DELAY = 300;

const Products = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const inputRef = useRef(null);

  // Query with proper variables and policies
  const { loading, error, data, fetchMore,refetch } = useQuery(SEARCH_PRODUCTS, {
    
    fetchPolicy: "network-only", // First load from network
    nextFetchPolicy: "cache-first", // Then use cache for subsequent queries
    notifyOnNetworkStatusChange: true // To show loading states properly
  });

  // Debounced search handler
 

  // Immediate input handler
  const handleSearch =(text:string) => {
    setSearchText(text);
    refetch({input:text,take:10})
  }
  // Memoized products with proper type checking
  const products = useMemo(() => {
    if (!data?.searchProduct?.products) return [];
    return data.searchProduct.products;
  }, [data?.searchProduct?.products]);

  // Load more handler with proper checks
  const handleLoadMore = useCallback(() => {
    if (loading) return; // Prevent multiple loads while loading
    
    const currentCursor = data?.searchProduct?.nextCursor;
    if (!currentCursor) return; // No more data to load
    
    fetchMore({
      variables: {
        cursor: currentCursor,
        take: ITEMS_PER_PAGE,
        input: debouncedSearchText
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.searchProduct) return prev;
        if (!prev?.searchProduct) return fetchMoreResult;
        
        return {
          searchProduct: {
            ...fetchMoreResult.searchProduct,
            products: [
              ...prev.searchProduct.products,
              ...fetchMoreResult.searchProduct.products,
            ],
          },
        };
      },
    }).catch(error => {
      console.error('Error loading more products:', error);
    });
  }, [loading, data?.searchProduct?.nextCursor, fetchMore, debouncedSearchText]);

  const renderProductItem = useCallback(({ item }:any) => {
    if (!item) return null;

    return (
      <View className="flex-row items-center bg-white p-4 mx-4 my-2 rounded-lg shadow-sm">
        <Image 
          source={{ uri: item.image }} 
          className="w-16 h-16 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold">{item.name || 'Unnamed Product'}</Text>
          <Text className="text-sm text-gray-600">${item.price || '0.00'}</Text>
        </View>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const EmptyListComponent = useCallback(() => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-500">
        {loading ? 'Loading products...' : 'No products found'}
      </Text>
    </View>
  ), [loading]);

  const FooterComponent = useCallback(() => {
    if (!loading || !products.length) return null;
    
    return (
      <View className="p-4">
        <ActivityIndicator color="#4B5563" />
      </View>
    );
  }, [loading, products.length]);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading products</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header iSearch setSearchText={handleSearch} />

      

      <FlatList
        data={products}
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => <RenderProductItem item={item} />}
        onEndReached={handleLoadMore}
        numColumns={2}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyListComponent />}
        ListFooterComponent={<FooterComponent />}
        contentContainerStyle={!products.length ? { flex: 1 } : null}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
};

export default Products;