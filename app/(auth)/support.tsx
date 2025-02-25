import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Header from '../components/productHeader';

const Support =()=> {
  const infosContact = {
    telephone: '+212601721564',
    email: 'contact@epicsmoke.ma',
    whatsapp: '+212601721564',
  };

  const gererAppelTelephone = () => {
    Linking.openURL(`tel:${infosContact.telephone}`);
  };

  const gererEmail = () => {
    Linking.openURL(`mailto:${infosContact.email}`);
  };

  const gererWhatsApp = () => {
    Linking.openURL(`https://wa.me/${infosContact.whatsapp}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header isCollection='Assistance'/>
      <ScrollView className="flex-1">
        {/* En-tête */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-slate-800">Assistance</Text>
          <Text className="text-base text-slate-500 mt-1">
            Nous sommes là pour vous aider. Contactez-nous via l'un de ces canaux.
          </Text>
        </View>
        
        {/* Options de Support */}
        <View className="px-6 py-4">
          {/* Carte Téléphone */}
          <TouchableOpacity 
            onPress={gererAppelTelephone}
            className="flex-row items-center p-5 bg-white rounded-2xl mb-4 shadow-sm"
          >
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <Feather name="phone" size={22} color="#3b82f6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-slate-800">Appelez-nous</Text>
              <Text className="text-slate-500">{infosContact.telephone}</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#94a3b8" />
          </TouchableOpacity>
          
          {/* Carte Email */}
          <TouchableOpacity 
            onPress={gererEmail}
            className="flex-row items-center p-5 bg-white rounded-2xl mb-4 shadow-sm"
          >
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Feather name="mail" size={22} color="#8b5cf6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-slate-800">Email</Text>
              <Text className="text-slate-500">{infosContact.email}</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#94a3b8" />
          </TouchableOpacity>
          
          {/* Carte WhatsApp */}
          <TouchableOpacity 
            onPress={gererWhatsApp}
            className="flex-row items-center p-5 bg-white rounded-2xl mb-4 shadow-sm"
          >
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
              <Feather name="message-circle" size={22} color="#22c55e" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-slate-800">WhatsApp</Text>
              <Text className="text-slate-500">{infosContact.whatsapp}</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        
        {/* Section FAQ */}
        <View className="px-6 py-4 mt-2">
          <Text className="text-xl font-bold text-slate-800 mb-4">Questions Fréquemment Posées</Text>
          
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-base font-semibold text-slate-800">Quels sont vos horaires d'ouverture ?</Text>
            <Text className="text-sm text-slate-500 mt-2">Nous sommes disponibles du lundi au vendredi, de 9h00 à 18h00.</Text>
          </View>
          
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-base font-semibold text-slate-800">Combien de temps faut-il pour obtenir une réponse ?</Text>
            <Text className="text-sm text-slate-500 mt-2">Nous répondons généralement à toutes les demandes dans un délai de 24 heures pendant les jours ouvrables.</Text>
          </View>
          
          <View className="bg-white p-5 rounded-2xl shadow-sm">
            <Text className="text-base font-semibold text-slate-800">Proposez-vous une assistance le week-end ?</Text>
            <Text className="text-sm text-slate-500 mt-2">L'assistance pendant le week-end est disponible pour les questions urgentes via WhatsApp.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default Support