import React, { useCallback } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { router, useRouter } from "expo-router";
import { addCollectionId, addMarkId } from "../slices/products";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
type Service = {
  id: string;
  name: string;
  photo: string;
};


type ServicePros={
  isPage?:boolean,
  services:Service[],
  name:string
}
const ServiceList = ({ isPage,services,name }:ServicePros) => {
  const dispatch = useDispatch();
    const handleSetCollectionId = useCallback((id: string) => {

      if(name==="mark"){

        dispatch(addMarkId(id));
      router.navigate('/(auth)/products_by_mark');
      return
      }
      dispatch(addCollectionId(id));
      router.navigate('/(auth)/products_by_collection');
    }, [dispatch]);
  
  
   
    
    const renderServiceItem = useCallback(({ item }: { item: Service }) => (
      <TouchableOpacity 
        className="items-center w-24 mr-6"
        onPress={() => handleSetCollectionId(item.id)}
      >
        <View className={`border border-gray-100  rounded-lg p-4 ${name === "collections" ? "bg-[#f6f6f6]":"bg-white"}`}>
        <Image 
          source={{ uri: item.photo }} 
          className="w-20 h-20  "
          resizeMode="contain"
        />
        </View>
        <Text className="text-sm text-gray-600 mt-2 font-medium text-center">
          {item.name}
        </Text>
      </TouchableOpacity>
    ), [handleSetCollectionId]);

  return (
    <>
    {
      isPage? <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "35%",
            marginBottom: 15,
          }}
          onPress={() => handleSetCollectionId(item.id)}
        >
          <Image
            source={{ uri: item.photo }}
            className="bg-gray-300 border border-gray-100"
            style={{ width: 100, height: 100, borderRadius: 10 }}
            resizeMode="contain"
          />
          <Text style={{
            fontSize: 14,
            color: "#555",
            marginTop: 8,
            fontWeight: "500",
            textAlign: "center",
          }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />:<FlatList
    horizontal
    data={services}
    renderItem={renderServiceItem}
    keyExtractor={(item) => item.id}
    className="px-6"
    showsHorizontalScrollIndicator={false}

  />
    }
    </>
  );
};

export default ServiceList;
