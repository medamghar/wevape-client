import { ActivityIndicator, Alert, Keyboard, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from 'react-native-paper';
import { useAuth } from "../auth";
import { Navigator, router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import Omodal from "../components/modal";
import { useDispatch, useSelector } from "react-redux";
import { ModalStatus } from "../slices/modal";
import type { RootState } from "../store";
import { gql, useMutation, useQuery } from "@apollo/client";
import COMPLETE_USER_MUTATION from "../gql/mutations";


// Define interfaces for our types
interface UserState {
  name: string;
  city:string,
  raisonSocial: string;
  address: string;
  latitude: string;
  longitude: string;

}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const initialUserState: UserState = {
  name: '',
  city:'',
  raisonSocial: '',
  address: '',
  latitude: '',
  longitude: '',
};

const OnBoarding: React.FC = () => {

  const [completeUser, { data, loading, error }] = useMutation(COMPLETE_USER_MUTATION);

  const dispatch = useDispatch();
  const { logout } = useAuth();
  // Redux selectors
  const modalOpen = useSelector((state: RootState) => state.modal.open);
  const city = useSelector((state: RootState) => state.modal.city);
  
  // State
  const [user, setUser] = useState<UserState>(initialUserState);
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Handlers
  const handleDone = (): void => {
    Keyboard.dismiss();
  };

  const handleChange = (field: keyof UserState) => (text: string): void => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: text,
    }));
  };

  const handleLogout = (): void => {
    router.navigate("/(auth)/welcome");
  };

  const getLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied");
        Alert.alert('Error', 'Location permission is required');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude }: LocationCoords = locationData.coords;

      setUser(prevUser => ({
        ...prevUser,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
    } catch (error) {
      setErrorMsg("Error getting location");
      Alert.alert('Error', 'Failed to get location');
      console.error('Location error:', error);
    }
  };

  const handleSubmit = async(): Promise<void> => {
    const requiredFields: (keyof UserState)[] = ['name', 'raisonSocial', 'address'];
    const missingFields = requiredFields.filter(field => !user[field]);

    if (missingFields.length > 0  || city === '') {
      Alert.alert('Error', `Please fill in all required fields: ${missingFields.join(', ')} , ${ city === '' && "Ville"}`);
      return;
    }
    completeUser(
      {variables:{
        name:user.name,
        city,
        raisonsocial:user.raisonSocial,
        adress:user.address,
        longitude:user.longitude,
        latitude:user.latitude

      }}
    )
    router.navigate('/(auth)/under_review');
  };

  const renderLocationInputs = (): JSX.Element => (
    <View className="flex flex-row w-full items-center gap-6">
      <View className="flex gap-2 flex-1">
        <TextInput
          label="Latitude"
          value={user.latitude}
          mode="outlined"
          outlineColor="#293777"
          activeOutlineColor="#293777"
          selectionColor="#293777"
          editable={false}
          style={{
            backgroundColor: "transparent",
          }}
        />
        <TextInput
          label="Longitude"
          value={user.longitude}
          mode="outlined"
          outlineColor="#293777"
          activeOutlineColor="#293777"
          selectionColor="#293777"
          editable={false}
          style={{
            backgroundColor: "transparent",
          }}
        />
      </View>
      <TouchableOpacity 
        onPress={getLocation} 
        className="flex items-center justify-center w-20 h-20 rounded-lg p-4 bg-[#293777]"
      >
        <Ionicons color="white" size={32} name="locate"/>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <TouchableWithoutFeedback onPress={handleDone}>
        <View className="w-full flex items-center mt-16 gap-12">
          <View className="flex items-center gap-2">
            <Text className="text-4xl font-bold text-[#293777]">Complétez votre profil</Text>
            <Text className="text-center px-4">
              Complétez votre profil pour une expérience personnalisée
            </Text>
          </View>

          <View className="w-full px-6 flex gap-6">
            <TextInput
              label="Nom complet"
              value={user.name}
              onChangeText={handleChange('name')}
              mode="outlined"
              outlineColor="#293777"
              activeOutlineColor="#293777"
              selectionColor="#293777"
              style={{ backgroundColor: "transparent" }}
            />

            <Omodal />

            <TextInput
              label="Raison sociale"
              value={user.raisonSocial}
              onChangeText={handleChange('raisonSocial')}
              mode="outlined"
              outlineColor="#293777"
              activeOutlineColor="#293777"
              selectionColor="#293777"
              style={{ backgroundColor: "transparent" }}
            />

            <TouchableOpacity onPress={() => dispatch(ModalStatus({ open: true }))}>
              <TextInput
                label="Ville"
                value={city}
                mode="outlined"
                outlineColor="#293777"
                activeOutlineColor="#293777"
                selectionColor="#293777"
                editable={false}
                style={{
                  backgroundColor: "transparent",
                  maxHeight: 60
                }}
              />
            </TouchableOpacity>

            <TextInput
              label="Adresse"
              value={user.address}
              onChangeText={handleChange('address')}
              mode="outlined"
              outlineColor="#293777"
              activeOutlineColor="#293777"
              selectionColor="#293777"
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: "transparent",
                maxHeight: 60
              }}
            />

            {renderLocationInputs()}

            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center p-4 rounded-lg bg-[#293777]"
            >
            {
              loading?<ActivityIndicator color="white" /> :<Text className="text-white text-lg">Complete</Text>

            }
            </TouchableOpacity>
           
          
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OnBoarding;