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
        <Stack.Screen name="products" />
        <Stack.Screen name="Admintabs" options={{ headerShown: false }} />
        <Stack.Screen name="Search" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="(ProfileTabs)/About" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         <Stack.Screen name="Settings" options={{ headerShown: false }} />
        <Stack.Screen name="singlepage" options={{ headerShown: false }} />
        <Stack.Screen name="DisplayCategories" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}

export default Layout;