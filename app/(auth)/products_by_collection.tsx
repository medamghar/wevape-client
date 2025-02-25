import { router } from "expo-router";
import { useEffect, useCallback } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import type { RootState } from "../store";
import { Product } from "../types/types";
import { GET_COLLECTION } from "../gql/queries";
import { LIKE_PRODUCT } from "../gql/mutations";
import RenderProductItem from "../components/products";
import Header from "../components/productHeader";



const ProductsByCollection = () => {

  

  const collectionId = useSelector((state: RootState) => state.products.collection_id);
  const { loading, error, data, fetchMore } = useQuery(GET_COLLECTION, {
    variables: { 
      id: collectionId,
      take: 12,
      cursor: null 
    },
    skip: !collectionId,
  });

  const handleLoadMore = useCallback(() => {
    const currentCursor = data?.getCollectionById?.nextCursor;
    if (currentCursor) {
      fetchMore({
        variables: { cursor: currentCursor },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getCollectionById: {
            ...fetchMoreResult.getCollectionById,
            collection: {
              ...fetchMoreResult.getCollectionById.collection,
              products: [
                ...prev.getCollectionById.collection.products,
                ...fetchMoreResult.getCollectionById.collection.products
              ]
            }
          }
        })
      });
    }
  }, [data, fetchMore]);

 

  

  if (error) return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500 text-lg">Error loading products</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header isCollection={data?.getCollectionById?.collection?.name} />
      
      <FlatList
        data={data?.getCollectionById?.collection?.products || []}
        renderItem={({ item }) => <RenderProductItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0}
        ListFooterComponent={
          loading ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#293777" />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ProductsByCollection;