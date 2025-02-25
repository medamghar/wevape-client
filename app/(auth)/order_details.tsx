import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { gql, useQuery } from '@apollo/client';
import Header from '../components/productHeader';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Définir la requête GraphQL
const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderId: Int!) {
    getOrdersDetails(orderId: $orderId) {
      variants {
        id
        name
        photo
      }
      order {
        id
        totalAmount
        status
        createdAt
        orderProducts {
          orderId
          quantity
          price
        }
        orderLines {
          id
          quantity
          variantId
          totalPrice
          unitPrice
        }
      }
    }
  }
`;

export default function OrderDetailsScreen() {
  const orderIdStr = useSelector((state: RootState) => state.products.orderId);
  const orderId =parseInt(orderIdStr)
  const { loading, error, data } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderId },
    fetchPolicy: 'cache-and-network',
  });

  // Afficher l'état de chargement
  if (loading && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white pt-12">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Chargement des détails de la commande...</Text>
      </View>
    );
  }

  // Afficher l'état d'erreur
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white pt-12 px-4">
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-bold text-center">Un problème est survenu</Text>
        <Text className="mt-2 text-gray-600 text-center">{error.message}</Text>
        <TouchableOpacity 
          className="mt-6 bg-black px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Déstructurer les données
  const { variants, order } = data.getOrdersDetails;
  const orderDate = new Date(parseInt(order.createdAt));
  const formattedDate = format(orderDate, 'dd MMM yyyy • HH:mm', { locale: fr });

  // Traduire le statut en français
  const translateStatus = (status:string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'CONFIRMÉE';
      case 'PENDING':
        return 'EN ATTENTE';
      case 'CANCELLED':
        return 'ANNULÉE';
      default:
        return status;
    }
  };

  const getStatusColor = (status:string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
     <Header isCollection='Détails de la Commande'/>
      
      <ScrollView className="flex-1 px-4">
        {/* Carte d'information de commande */}
        <View className="bg-white rounded-xl shadow-sm mt-4 p-4 border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold">Commande #{order.id}</Text>
              <Text className="text-gray-500 text-sm">{formattedDate}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              <Text className="font-medium">{translateStatus(order.status)}</Text>
            </View>
          </View>
          
          <View className="h-px bg-gray-100 my-2" />
          
          {/* Détails du produit */}
          <View className="my-4">
            <Text className="font-bold text-gray-700 mb-4">Articles Commandés</Text>
            
            {variants.map((data:any,index:any)=><View className="flex-row border border-gray-100 rounded-lg p-3 " key={index}>
              <Image 
                source={{ uri: data.photo }} 
                className="w-20 h-20 rounded-md bg-gray-50"
                resizeMode="contain"
              />
              <View className="ml-4 flex-1 justify-center">
                <Text className="font-bold text-lg">{data.name}</Text>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-gray-500">Quantité: {order.orderLines[index].quantity}</Text>
                  <Text className="font-bold">{order.orderLines[0].unitPrice} DH</Text>
                </View>
              </View>
            </View>)}
          </View>
          
          {/* Détail des prix */}
          <View className="my-4">
            <Text className="font-bold text-gray-700 mb-4">Détails des Prix</Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Sous-total</Text>
                <Text className="font-medium">{order.orderLines[0].unitPrice * order.orderLines[0].quantity} DH</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Livraison</Text>
                <Text className="font-medium">0 DH</Text>
              </View>
              
              <View className="h-px bg-gray-100 my-2" />
              
              <View className="flex-row justify-between">
                <Text className="font-bold">Total</Text>
                <Text className="font-bold text-lg">{order.totalAmount} DH</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Bouton d'action */}
        <View className="my-6">
          <TouchableOpacity onPress={()=>router.navigate('/(auth)/support')} className="bg-gray-100 py-3 rounded-lg flex-row justify-center items-center">
            <Ionicons name="chatbubble-outline" size={20} color="#000" />
            <Text className="font-bold ml-2">Support</Text>
          </TouchableOpacity>
        </View>
        
        {/* Espacement en bas */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}