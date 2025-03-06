import { Stack } from 'expo-router';
import React from 'react';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register"  />
      {/* <Stack.Screen name="About"  /> */}
      <Stack.Screen name="singlepage"   options={{ headerShown: false }} 
 />
      </Stack>
  );
}

export default Layout;