import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native"

const Splach =({navigation}:any)=>{
  useEffect(() => {
    // Set a timeout to navigate to the Home screen after 5 seconds
    setTimeout(() => {
      router.navigate('./(auth)/welcome'); // Automatically navigate to the Home screen
    }, 5000);
  }, []);



return (

    <SafeAreaView className="flex-1 bg-[#293777]">

        <View className="w-full h-full flex items-center justify-center">
          <Text className="text-6xl font-Jakarta text-white"><Text className="font-JakartaExtraBold">W</Text>Stock</Text>
        </View>
    </SafeAreaView>
)


}


export default Splach