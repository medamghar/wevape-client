import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { 
  ActivityIndicator, 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Alert, 
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { gql } from '@apollo/client';
import { addPhone } from "../slices/otp";
import { RootState } from "../store";
import { useAuth } from "../auth";
import { GET_VERIFIED } from "../gql/queries";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import UnderReview from "./under_review";
import Home from "..";

// GraphQL mutation
const GENERATE_OTP = gql`
  mutation GenerateOTP($phone: String!) {
    generateOtp(phone: $phone) {
      ok
      message
    }
  }
`;

// Type definitions
type WelcomeProps = {};

const Welcome: React.FC<WelcomeProps> = () => {
  // State
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // Redux
  const dispatch = useDispatch();
  const phoneOtp = useSelector((state: RootState) => state.otp.phone);
  
  // Auth hook
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  
  // GraphQL queries
  const { data, loading: verificationLoading } = useQuery(GET_VERIFIED);

  // Set verified status when data changes
  useEffect(() => {
    if (data?.isVerified?.isVerified !== undefined) {
      setIsVerified(data.isVerified.isVerified);
    }
  }, [data]);

  // OTP mutation
  const [generateOtp, { loading: otpLoading }] = useMutation(GENERATE_OTP, {
    onCompleted: (data) => {
      if (data.generateOtp.ok) {
        dispatch(addPhone(`+212${phone.startsWith('0') ? phone.substring(1) : phone}`));
        router.replace("/(auth)/auth_code");
      } else {
        Alert.alert("Error", data.generateOtp.message);
      }
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
      console.error('OTP Generation failed:', error);
    }
  });

  // Validate Moroccan phone number
  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^(0|\+212)[567][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Handle phone input change
  const handlePhoneChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setPhone(numericText);
    setPhoneError('');
  };

  // Handle OTP generation
  const handleGenerateOtp = async (): Promise<void> => {
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid Moroccan phone number');
      return;
    }
    
    setPhoneError('');
    try {
      await generateOtp({
        variables: {
          phone: phone.startsWith('+212') ? phone : `+212${phone.startsWith('0') ? phone.substring(1) : phone}`
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  // Loading state
  if (authLoading || verificationLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Login component
  const Login = () => {
    return (
      <SafeAreaView className="flex-1">
      <View className="w-full h-full px-6 pt-8 flex-col">
        {/* Header */}
        <View className="items-center mb-12">
         
          <Text className="text-3xl font-bold text-blue-600 text-center mb-2">
            Bienvenue
          </Text>
          <Text className="text-gray-600 text-center text-base mb-1">
            Rejoindre par numéro de téléphone
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Vous recevrez un code par SMS pour vérifier votre numéro.
          </Text>
        </View>
        
        {/* Phone input */}
        <View className="mb-8">
          <View className="flex flex-row w-full gap-2 mb-1.5">
            <View className="h-14 justify-center px-3 bg-gray-50 rounded-xl border border-gray-200">
              <Text className="text-lg font-medium text-gray-700">+212</Text>
            </View>
            <View className="flex-1 h-14 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
              <TextInput
                value={phone}
                keyboardType="phone-pad"
                onChangeText={handlePhoneChange}
                className="flex-1 px-4 text-lg font-medium text-gray-800"
                placeholder="601721564"
                placeholderTextColor="#9CA3AF"
                textContentType="telephoneNumber"
                returnKeyType="done"
                maxLength={10}
                blurOnSubmit={false}
              />
            </View>
          </View>
          
          
          {phoneError ? (
            <View className="flex-row items-center mt-1 ml-1">
              <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
              <Text className="text-red-500 text-sm ml-1">
                {phoneError}
              </Text>
            </View>
          ) : null}
        </View>
        
        {/* Verify button */}
        <TouchableOpacity
          onPress={handleGenerateOtp}
          disabled={otpLoading || !phone}
          className={`w-full rounded-xl h-14 flex justify-center items-center shadow-sm ${
            otpLoading || !phone ? 'bg-blue-300' : 'bg-blue-600'
          }`}
          activeOpacity={0.8}
        >
          {otpLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white">Vérifier</Text>
          )}
        </TouchableOpacity>
        
        {/* Terms */}
        <Text className="text-xs text-gray-400 text-center mt-6">
          En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
        </Text>
      </View>
      </SafeAreaView>
    );
  };

  // Main render
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        {!isAuthenticated ? (
          <Login /> // Show login screen if not authenticated
        ) : !isVerified ? (
          <UnderReview /> // Show under review screen if not verified
        ) : (
          <Home /> // Proceed to home screen
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Welcome;