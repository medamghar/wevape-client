import { router } from "expo-router";
import { useEffect, useCallback } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import type { RootState } from "../store";
import { Product } from "../types/types";
import { GET_MARKS_BY_ID } from "../gql/queries";
import { LIKE_PRODUCT } from "../gql/mutations";
import RenderProductItem from "../components/products";
import Header from "../components/productHeader";



const ProductsByMark = () => {

  

  const markId = useSelector((state: RootState) => state.products.mark_id);
  const { loading, error, data, fetchMore } = useQuery(GET_MARKS_BY_ID, {
    variables: { 
      id: markId,
      take: 12,
      cursor: null 
    },
    skip: !markId,
  });
  const handleLoadMore = useCallback(() => {
    const currentCursor = data?.getMarkId?.nextCursor;
    if (currentCursor) {
      fetchMore({
        variables: { cursor: currentCursor },
        updateQuery: (prev, { fetchMoreResult }) => ({
            getMarkId: {
            ...fetchMoreResult.getMarkId,
            mark: {
              ...fetchMoreResult.getMarkId.mark,
              products: [
                ...prev.getMarkId.mark.products,
                ...fetchMoreResult.getMarkId.mark.products
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
      <Header isCollection={data?.getMarkId?.mark?.name} />
      
      <FlatList
        data={data?.getMarkId?.mark?.products || []}
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

export default ProductsByMark;