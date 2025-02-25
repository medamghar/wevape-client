import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import Splach from "./splash";

const Home = () => {
  const Stack = createStackNavigator();




  return (

      <GestureHandlerRootView style={{ flex: 1 }}>
        <Splach/>
      </GestureHandlerRootView>
      
     
  );
};

export default Home;
