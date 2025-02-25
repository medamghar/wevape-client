import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { EyeIcon } from "lucide-react-native";
import Header from "../components/productHeader";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../gql/queries";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { addOrderId } from "../slices/products";

interface OrderProduct {
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  orderProducts: OrderProduct[];
}

const statusColors: { [key: string]: string } = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-purple-500",
  SHIPED: "bg-blue-600",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
};

const statusBackgrounds: { [key: string]: string } = {
  PENDING: "bg-amber-50",
  CONFIRMED: "bg-purple-50",
  SHIPED: "bg-blue-50",
  DELIVERED: "bg-emerald-50",
  CANCELLED: "bg-rose-50",
};

interface OrderItemProps {
  order: Order;
  onPress: (order: Order) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onPress }) => {

  const dispatch =useDispatch()
  const timestamp = parseInt(order.createdAt, 10);
  const date = new Date(timestamp);
  const isValidDate = !isNaN(date.getTime());
  const formattedDate = isValidDate 
    ? date.toLocaleDateString(undefined, { 
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Invalid Date";

  // Calculate total quantity from orderProducts
  const totalQuantity = order.orderProducts.reduce((sum, product) => sum + product.quantity, 0);
 const handleOrder=(orderId :string)=>{
  dispatch(addOrderId(orderId))
  router.navigate('/(auth)/order_details')


 }
  return (
    <TouchableOpacity
      onPress={() => handleOrder(order.id)}
      style={styles.orderCard}
      className={`
        mx-4 my-2 p-4 rounded-xl
        bg-white
        border border-gray-100
        ${statusBackgrounds[order.status]}
      `}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-lg font-bold text-gray-900">
            #00{order.id}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {formattedDate}
          </Text>
        </View>
        <View className={`
          px-3 py-1.5 rounded-full
          ${statusColors[order.status] || "bg-gray-500"}
        `}>
          <Text className="text-xs font-semibold text-white">
            {order.status}
          </Text>
        </View>
      </View>

      <View className="space-y-2">
        <View className="flex-row justify-between items-center pr-12">
          <Text className="text-gray-600">Total Amount</Text>
          <Text className="text-lg font-semibold text-gray-900">
            {order.totalAmount.toFixed(2)} DH
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center pr-12">
          <Text className="text-gray-600">Total Items</Text>
          <Text className="text-lg font-semibold text-gray-900">
            {totalQuantity}
          </Text>
        </View>
      </View>
       
      <TouchableOpacity onPress={()=>handleOrder(order.id)} className="absolute top-1/2 right-4">
        <View className="bg-gray-100/80 p-2 rounded-full">
          <EyeIcon size={20} color="#374151" />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }
});

export default function OrderList() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOrderPress = (order: Order) => {
  };
  
  const orders = data?.getOrders;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header isCollection="Orders" />

      {loading && !refreshing ? (
        <View className="justify-center items-center">
          <Text className="text-gray-500">Loading orders...</Text>
        </View>
      ) : error ? (
        <View className=" justify-center items-center p-4">
          <Text className="text-rose-500 text-center">
            Error loading orders. Please try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderItem order={item} onPress={handleOrderPress} />
          )}
          contentContainerClassName="py-2"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#4B5563"
              colors={["#4B5563"]}
              progressBackgroundColor="#F9FAFB"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}