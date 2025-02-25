import { AntDesign } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native'

const OrderPlace = () => {
    const navigation = useNavigation();
    const handleNavigateToLoadingProfile = () => {
        router.push('/(auth)/home')
      };
  return (
    <SafeAreaView className="flex-1 bg-emerald-700">
      <View className="flex-1 items-center justify-center gap-8 px-8">
        
        {/* Success Icon */}
        <View className="bg-white/10 p-6 rounded-full">
          <AntDesign name="checkcircle" color="white" size={72} />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-extrabold text-white text-center">
          Commande passée avec succès !
        </Text>

        {/* Buttons */}
        <View className="w-full flex gap-4">
          {/* Continue Shopping */}
          <TouchableOpacity onPress={handleNavigateToLoadingProfile} className="bg-white px-8 py-4 rounded-full shadow-lg active:opacity-80">
            <Text className="text-emerald-700 font-semibold text-lg text-center">
              Continuer les achats
            </Text>
          </TouchableOpacity>

          {/* View Orders */}
          <TouchableOpacity onPress={()=>router.navigate('/(auth)/orders')}  className="border border-white px-8 py-4 rounded-full active:opacity-80">
            <Text className="text-white font-semibold text-lg text-center">
              Voir les commandes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default OrderPlace
