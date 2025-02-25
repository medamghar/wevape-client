import { Stack } from "expo-router"

const Layout =()=>{

  
    

    return(
        <Stack>
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="splash" options={{ headerShown: false }} />
                <Stack.Screen name="auth_code" options={{ headerShown: false }} />
                <Stack.Screen name="loading-profile" options={{ headerShown: false }} />
                <Stack.Screen name="on-bording" options={{ headerShown: false }} />
                <Stack.Screen name="products_by_collection" options={{ headerShown: false }} />
                <Stack.Screen name="favoritesScreen" options={{ headerShown: false }} />
                <Stack.Screen name="product" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="order_place" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
                <Stack.Screen name="products" options={{ headerShown: false }} />
                <Stack.Screen name="under_review" options={{ headerShown: false }} />
                <Stack.Screen name="products_by_mark" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
                <Stack.Screen name="collections" options={{ headerShown: false }} />
                <Stack.Screen name="promotions" options={{ headerShown: false }} />
                <Stack.Screen name="orders" options={{ headerShown: false }} />
                <Stack.Screen name="order_details" options={{ headerShown: false }} />
                <Stack.Screen name="support" options={{ headerShown: false }} />
                <Stack.Screen name="brands" options={{ headerShown: false }} />



























              </Stack>
    )
}

export default Layout