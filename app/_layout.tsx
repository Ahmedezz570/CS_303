import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register"  />
    </Stack>
  );
}

export default Layout;