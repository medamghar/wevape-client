import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { GET_VERIFIED } from '../gql/queries';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth';

const UnderReview = () => {
    const { logout } = useAuth();
    
    const { data, loading, error } = useQuery(GET_VERIFIED, {
      pollInterval: 5000, // Check every 5 seconds
    });
    
    useEffect(() => {
      if (!data || loading) return; // Ensure data is available before accessing it
    
      const { ok, userFound } = data.isVerified || {}; // Prevent undefined destructuring
    
      if (ok) {
        router.replace('/home'); // Navigate to the home screen after verification
        return;
      }
    
      if (userFound === false) {
        logout(); // Logout before redirecting
        router.push('/(auth)/welcome');
        return;
      }
    }, [data, loading]); //
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Ionicons name='shield-checkmark-sharp' color="green" size={80} className=" mb-4" />
      <Text className="text-lg font-bold text-gray-800">Your Account is Under Review</Text>
      <Text className="text-sm text-gray-600 mt-2 text-center">
        We are verifying your details. This usually takes a few minutes.
      </Text>
      {loading && <ActivityIndicator size="large" className="mt-4" color="#3b82f6" />}
      {error && <Text className="text-red-500 mt-2">Error checking status</Text>}
      {!loading && !data?.isVerified?.isVerified && (
        <Text className="text-sm text-gray-600 mt-4">
          If this takes too long, please contact support at +212601721564.
        </Text>
      )}
    </View>
  );
};

export default UnderReview;
