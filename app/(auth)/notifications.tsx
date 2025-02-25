import { View, FlatList, Text, TouchableOpacity, SafeAreaView, Animated, Image } from 'react-native';
import { useNotifications } from '../NotificationsProvider';
import { Bell, Check, ChevronRight } from 'lucide-react-native';
import { useRef, useEffect } from 'react';
import Header from '../components/productHeader';
import { router } from 'expo-router';

const getRelativeTimeInFrench = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  if (hours < 24) return `Il y a ${hours} ${hours === 1 ? 'heure' : 'heures'}`;
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  return time.toLocaleDateString('fr-FR');
};

const NotificationItem = ({ item, markAsRead }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        }],
      }}
    >
          <TouchableOpacity onPress={()=>router.push(item?.route ? item.route:"/(auth)/notifications")}>

      <View className="bg-white rounded-lg shadow-sm mx-4 my-2 p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className={`w-2 h-2 rounded-full mr-3 ${item.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
            
            {/* Image container */}
            <View className="w-12 h-12 rounded-lg overflow-hidden mr-3">
              {item.imageUrl  ? (
                <Image 
                  source={{ uri: item.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-200 items-center justify-center">
                  <Bell size={20} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-gray-800 font-medium text-base">{item.title}</Text>
              <Text className="text-gray-600 text-sm mt-1">{item.message}</Text>
              <Text className="text-gray-400 text-xs mt-2">
                {getRelativeTimeInFrench("2025-02-23T02:05:22.080Z")}
              </Text>
            </View>
          </View>
          
          {!item.isRead && (
            <TouchableOpacity 
              onPress={() => markAsRead(item.id)}
              className="bg-blue-50 rounded-full p-2 ml-3"
            >
              <Check size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
          <ChevronRight size={16} color="#9CA3AF" className="ml-2" />
        </View>
      </View>
      </TouchableOpacity>

    </Animated.View>
  );
};

const EmptyState = () => (
  <View className="flex-1 justify-center items-center p-8">
    <Bell size={48} color="#9CA3AF" />
    <Text className="text-gray-600 text-lg font-medium mt-4">Aucune notification</Text>
    <Text className="text-gray-400 text-center mt-2">
      Vos notifications apparaîtront ici
    </Text>
  </View>
);

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <SafeAreaView className="flex-1 bg-white">
            <Header isCollection='Notifications'/>

      <View className="flex-row justify-end items-center p-4 ">
        {notifications.length > 0 && (
          <Text className="text-gray-500 text-sm">
            {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
          </Text>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem item={item} markAsRead={markAsRead} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={notifications.length === 0 && { flex: 1 }}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Notifications;