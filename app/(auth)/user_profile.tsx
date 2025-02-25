import { ActivityIndicator, Alert, Keyboard, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from 'react-native-paper';
import { useAuth } from "../auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import Omodal from "../components/modal";
import { useDispatch, useSelector } from "react-redux";
import { ModalStatus, setModalCity } from "../slices/modal";
import type { RootState } from "../store";
import { useMutation, useQuery } from "@apollo/client";
import COMPLETE_USER_MUTATION from "../gql/mutations";
import { GET_USER } from "../gql/queries";
import Header from "../components/productHeader";

// Définition des interfaces pour nos types
interface UserState {
  name: string;
  raisonSocial: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const ProfilUtilisateur: React.FC = () => {
  const [completeUser, { data, loading, error }] = useMutation(COMPLETE_USER_MUTATION);
  const { data: data1, loading: loading1, error: error1 } = useQuery(GET_USER);

  const dispatch = useDispatch();
  const { logout } = useAuth();

  // Sélecteurs Redux
  const modalOpen = useSelector((state: RootState) => state.modal.open);
  const city = useSelector((state: RootState) => state.modal.city);

  // État
  const [user, setUser] = useState<UserState>({
    name: '',
    raisonSocial: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false );
  const [isCompleteDisabled, setIsCompleteDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (data1 && !loading1) {
      setUser({
        name: data1?.getUser?.name,
        raisonSocial: data1?.getUser?.RaisonSocial,
        address: data1?.getUser?.location?.address,
        latitude: data1?.getUser?.location?.latitude,
        longitude: data1?.getUser?.location?.longitude,
      });
      dispatch(setModalCity(data1?.getUser?.location?.city))
    }
  }, [data1, loading1]);

  // Gestionnaires d'événements
  const handleDone = (): void => {
    Keyboard.dismiss();
  };

  const handleChange = (field: keyof UserState) => (text: string): void => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: text,
    }));
  };

  const getLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'L\'autorisation de localisation est requise');
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
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation');
    }
  };

  useEffect(() => {
    const requiredFields: (keyof UserState)[] = ['name', 'raisonSocial', 'address'];
    const isFilled = requiredFields.every(field => user[field] !== '') && city !== '';
    setIsCompleteDisabled(!isFilled);
  }, [user, city]);

  const handleSubmit = async (): Promise<void> => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir compléter votre profil ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            completeUser({
              variables: {
                name: user.name,
                city,
                raisonsocial: user.raisonSocial,
                adress: user.address,
                longitude: user.longitude.toString(),
                latitude: user.latitude.toString()
              },
              onCompleted: () => {
                Alert.alert("Succès", "Votre profil a été mis à jour.");
                router.navigate('/(auth)/home');
              },
              onError: (error) => {
                Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
                console.error(error);
              }
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header isCollection="Profil"/>
      
      <TouchableWithoutFeedback onPress={handleDone}>
        <View className="flex-1 px-5">
          {/* En-tête du profil */}
          <View className="flex-row justify-between items-center py-4 mb-2">
            <Text className="text-2xl font-bold text-slate-800">Mon Profil</Text>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full"
            >
              <Feather name={isEditing ? "check" : "edit-2"} size={18} color="#4F46E5" />
              <Text className="text-indigo-600 font-medium ml-2">
                {isEditing ? "Terminer" : "Modifier"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Carte de profil */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-500 mb-1">Nom complet</Text>
              <TextInput
                value={user.name}
                onChangeText={handleChange('name')}
                mode="outlined"
                outlineColor={isEditing ? "#4F46E5" : "#E5E7EB"}
                activeOutlineColor="#4F46E5"
                selectionColor="#4F46E5"
                editable={isEditing}
                style={{ backgroundColor: "white", height: 48 }}
                className="rounded-xl"
                placeholder="Votre nom complet"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-500 mb-1">Raison sociale</Text>
              <TextInput
                value={user.raisonSocial}
                onChangeText={handleChange('raisonSocial')}
                mode="outlined"
                outlineColor={isEditing ? "#4F46E5" : "#E5E7EB"}
                activeOutlineColor="#4F46E5"
                selectionColor="#4F46E5"
                editable={isEditing}
                style={{ backgroundColor: "white", height: 48 }}
                className="rounded-xl"
                placeholder="Raison sociale de l'entreprise"
              />
            </View>

            <TouchableOpacity 
              onPress={() => isEditing && dispatch(ModalStatus({ open: true }))}
              disabled={!isEditing}
              className="mb-4"
            >
              <Text className="text-xs font-medium text-gray-500 mb-1">Ville</Text>
              <TextInput
                value={city}
                mode="outlined"
                outlineColor={isEditing ? "#4F46E5" : "#E5E7EB"}
                activeOutlineColor="#4F46E5"
                selectionColor="#4F46E5"
                editable={false}
                style={{ backgroundColor: "white", height: 48 }}
                className="rounded-xl"
                placeholder="Sélectionnez votre ville"
                right={isEditing ? <TextInput.Icon icon="chevron-down" color="#4F46E5" /> : null}
              />
            </TouchableOpacity>

            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-500 mb-1">Adresse</Text>
              <TextInput
                value={user.address}
                onChangeText={handleChange('address')}
                mode="outlined"
                outlineColor={isEditing ? "#4F46E5" : "#E5E7EB"}
                activeOutlineColor="#4F46E5"
                selectionColor="#4F46E5"
                multiline
                numberOfLines={2}
                editable={isEditing}
                style={{ backgroundColor: "white" ,paddingTop:10 }}
                className="rounded-xl"
                placeholder="Votre adresse complète"
                
              />
            </View>

            {/* Coordonnées de localisation */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-500 mb-2">Coordonnées GPS</Text>
              <View className="flex-row gap-4 items-center space-x-4">
                <View className="flex-1 gap-4 space-y-2">
                  <View className="bg-gray-50 p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Latitude</Text>
                    <Text className="text-sm font-medium">{user.latitude || "Non définie"}</Text>
                  </View>
                  <View className="bg-gray-50 p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Longitude</Text>
                    <Text className="text-sm font-medium">{user.longitude || "Non définie"}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={getLocation}
                  disabled={!isEditing}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${isEditing ? "bg-indigo-600" : "bg-gray-200"}`}
                >
                  <Ionicons color="white" size={24} name="locate" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bouton de validation */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isCompleteDisabled || loading}
              className={`p-4 rounded-xl ${isCompleteDisabled || loading ? "bg-gray-300" : "bg-indigo-600"}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">Enregistrer</Text>
              )}
            </TouchableOpacity>
          )}
          
          <Omodal />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ProfilUtilisateur;