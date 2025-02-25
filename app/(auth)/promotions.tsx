import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/productHeader';
import { ChevronRight, Tag, Percent } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import { GET_PROMOTION } from '../gql/queries';
import { D } from 'graphql-ws/dist/common-DY-PBNYy';



const PromotionCard = ({ title, description, discount, endDate, onPress }:any) => (
  <TouchableOpacity 
    onPress={onPress}
    className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
  >
    <View className="flex-row justify-between items-center">
      <View className="flex-1">
        <View className="flex-row items-center mb-2">
        <AntDesign name='tagso' size={20} className="text-blue-500 mr-2" />

          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        </View>
        <Text className="text-gray-600 mb-2">{description}</Text>
        
        <Text className="text-gray-400 text-sm mt-2">Valable jusqu'au {endDate}</Text>
      </View>
      <ChevronRight size={20} className="text-gray-400" />
    </View>
  </TouchableOpacity>
);

const Promotions = () => {

    const {data,loading,error} = useQuery(GET_PROMOTION)
  const promotions = data?.getPromorionsHeader || []



  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header isCollection="Promotions" />
      
      <ScrollView className="flex-1 px-4 pt-4 w-full">
        <View className="flex-row items-center mb-6 w-full gap-4">
          <AntDesign name='tagso' size={24} className="text-blue-500 mr-2" />
          <Text className="text-2xl font-bold text-gray-800">Promotions Actives</Text>
        </View>

        {promotions.map((promo:any) => (
          <PromotionCard
            key={promo.id}
            {...promo}
            onPress={() =>{}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Promotions;