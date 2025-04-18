import { Stack } from 'expo-router';
import React from 'react';
import { CartProvider } from './item/CartContext';
const Layout = () => {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: true }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPass" options={{ headerShown: false }} />
        <Stack.Screen name="About" />
        <Stack.Screen name="Admintabs" options={{ headerShown: false }} />
        <Stack.Screen name="singlepage" options={{ headerShown: false }} />
        <Stack.Screen name="Categories/SeeAllCategories" options={{ title: "back" }} />
      </Stack>
    </CartProvider>
  );
}

export default Layout;