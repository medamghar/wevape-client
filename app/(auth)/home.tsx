import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, SafeAreaView, Alert, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import { AntDesign, Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import LoadingProfile from "./loading-profile";
import ProductsByCollection from "./products_by_collection";
import { useAuth } from "../auth";
import FavoritesScreen from "./favoritesScreen";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_LIKEDPRODUCT_QUERY, GET_USER } from "../gql/queries";
import { setFavProductsCount } from "../slices/likedProducts";
import { CartItem } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateCart } from "../slices/products";
import OrderPlace from "./order_place";
import Products from "./products";
import Orders from "./orders";
import UserProfie from "./user_profile";
import Header from "../components/productHeader";
import { router } from "expo-router";
import Collections from "./collections";
import Brands from "./brands";
import Promotions from "./promotions";
import OrderDetailsScreen from "./order_details";
import Cart from "./cart";

export type RootParamList = {
  LoadingProfile: undefined;
  Profile: undefined;
  Logout: undefined;
  OrderPlace: undefined;
  ProductsByCollection: undefined;
  Products: undefined;
  Orders: undefined;
  Collections: undefined;
  Brands: undefined;
  Promotions: undefined;
  OrderDetails: undefined;
  Support: undefined;

};

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const FavProductsCounter = useSelector((state: RootState) => state.prodctFavCounter.total);
  
  type MenuItem = {
    name: string;
    icon: React.ComponentProps<typeof AntDesign>["name"];
    screen: keyof RootParamList;
  };

  const menuItems: MenuItem[] = [
    { name: "Home", icon: "home", screen: "LoadingProfile" },
    { name: "Products", icon: "dropbox", screen: "Products" },
    { name: "Orders", icon: "profile", screen: "Orders" },

    { name: "Promotions", icon: "tagso", screen: "Promotions" },
    { name: "Collections", icon: "appstore1", screen: "Collections" },
    { name: "Brands", icon: "trademark", screen: "Brands" },
    { name: "Logout", icon: "logout", screen: "Logout" },
  ];
  
  const { data: data1, loading: loading1, error: error1 } = useQuery(GET_USER);

  return (
    <View className="flex-1 bg-white pt-6">
      {/* User Profile Section */}
      <TouchableOpacity 
        className="flex-row items-center mx-4 mb-6 p-4 bg-slate-50 rounded-2xl shadow-sm"
        onPress={() => navigation.navigate("Profile")}
      >
        <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 justify-center items-center mr-3">
          <AntDesign name="user" size={24} color="#000" />
        </View>
        
        <View className="flex-1">
          <Text className="text-slate-800 font-semibold text-base">
            {data1?.getUser?.name || "User Name"}
          </Text>
          <Text className="text-slate-500 text-xs">
            ID: #{data1?.getUser?.id?.toString().padStart(3, "0") || "000"}
          </Text>
        </View>
        
        <View className="w-8 h-8 rounded-full bg-slate-100 justify-center items-center">
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View className="h-px bg-slate-100 mx-4 my-2" />

      {/* Category Label */}
      <View className="px-6 mb-3 mt-2">
        <Text className="text-xs font-semibold text-slate-400 tracking-wider">
          MAIN MENU
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {menuItems.map((item) => {
            const isActive = currentRoute === item.screen;
            const isLogout = item.name === "Logout";
            
            return (
              <TouchableOpacity
                key={item.screen}
                className={`flex-row items-center p-3 mb-1.5 rounded-xl relative ${
                  isActive ? "bg-blue-50" : ""
                } ${isLogout ? "mt-3" : ""}`}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View className={`w-9 h-9 rounded-lg ${isActive ? "bg-blue-100" : "bg-slate-100"} justify-center items-center mr-3`}>
                  <AntDesign 
                    name={item.icon} 
                    size={18} 
                    color={isActive ? "#3b82f6" : isLogout ? "#ef4444" : "#64748b"} 
                  />
                </View>
                
                <Text className={`font-medium ${
                  isActive ? "text-blue-500 font-semibold" : isLogout ? "text-red-500" : "text-slate-600"
                }`}>
                  {item.name}
                </Text>
                
                {item.name === "Favorites" && (
                  <View className="min-w-[22px] h-[22px] rounded-full bg-green-500 justify-center items-center px-1.5 ml-auto">
                    <Text className="text-white text-xs font-semibold">
                      {FavProductsCounter}
                    </Text>
                  </View>
                )}
                
                {isActive && (
                  <View className="absolute right-0 top-1/2 -mt-3 w-1 h-6 bg-blue-500 rounded-sm" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Support Button */}
      <TouchableOpacity 
        className="flex-row items-center justify-center bg-blue-500 mx-4 mb-4 py-3.5 rounded-xl"
        onPress={() => router.navigate('/(auth)/support')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
        <Text className="text-white font-semibold ml-2">
          Chat with Support
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="p-4 border-t border-slate-100">
        <Text className="text-xs text-slate-400 text-center mb-1">
          Version 1.0.0
        </Text>
        <Text className="text-xs text-slate-400 text-center">
          © 2024 EpicSmoke - Wstock
        </Text>
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator<RootParamList>();

const LogoutScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => {logout(); router.push('/(auth)/welcome')}, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <View className="flex-1 justify-center items-center bg-white">
        <View className="w-4/5 p-6 rounded-xl bg-white shadow-lg items-center">
          <Text className="text-2xl font-bold mb-2">Logout</Text>
          <Text className="text-gray-500 text-center mb-6">
            Are you sure you want to log out?
          </Text>
          <TouchableOpacity
            className="bg-red-500 w-full flex flex-row justify-center gap-4 py-3 rounded-lg items-center"
            onPress={handleLogout}
          >
            <AntDesign name="logout" size={25} color="white"/>
            <Text className="text-white text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const AppNavigation = ({IsVeified}: any) => {
  const dispatch = useDispatch();
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCart(JSON.parse(cartData));
          dispatch(updateCart(JSON.parse(cartData).length));
        }
      } catch (error) {
        console.error('Error retrieving cart data:', error);
      }
    };

    fetchCart();
  }, [cart]);
  
  const { loading, error, data, refetch } = useQuery(GET_LIKEDPRODUCT_QUERY, {
    pollInterval: 10000, // refetch every 10 seconds
  });
  
  // Memoizing products list to prevent unnecessary renders
  const products = React.useMemo(() => data?.getLikedProducts ?? [], [data]);

  useEffect(() => {
    // Update favorite products count when products data changes
    dispatch(setFavProductsCount(products.length));
  }, [products, dispatch]);
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Drawer.Navigator
        initialRouteName="LoadingProfile"
        screenOptions={{
          drawerType: 'front',
          headerShown: false,
          overlayColor: 'transparent',
          drawerStyle: {
            width: '80%',
            backgroundColor: 'transparent',
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="LoadingProfile" component={LoadingProfile} />
        <Drawer.Screen name="ProductsByCollection" component={ProductsByCollection} />
        <Drawer.Screen name="Profile" component={UserProfie} />
        <Drawer.Screen name="Collections" component={Collections} />
        <Drawer.Screen name="Products" component={Products} />
        <Drawer.Screen name="OrderDetails" component={OrderDetailsScreen} />

        <Drawer.Screen name="Brands" component={Brands} />
        <Drawer.Screen name="Promotions" component={Promotions} />
        <Drawer.Screen name="Orders" component={Orders} />
        <Drawer.Screen name="Logout" component={LogoutScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigation;