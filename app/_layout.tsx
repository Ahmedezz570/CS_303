import { Stack } from 'expo-router';
import React from 'react';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="tabs"  options={{headerShown:false}}/>
      <Stack.Screen name="Login"  options={{headerShown:false}}/>
      <Stack.Screen name="Register"   options={{headerShown:false}}/>
     <Stack.Screen name="ForgetPass" options={{headerShown:false}} />
      {/* <Stack.Screen name="About"  /> */}

      <Stack.Screen name="singlepage"   options={{ headerShown: false }} />
      <Stack.Screen name="Categories/SeeAllCategories" options={{ title: "back" }} />
      <Stack.Screen name="Categories/pants" options={{ title: "back" }} />
      <Stack.Screen name="Categories/mobile" options={{ title: "back" }} />
      <Stack.Screen name="Categories/dresses" options={{ title: "back" }} />
      <Stack.Screen name="Categories/jackets" options={{ title: "back" }} />
      <Stack.Screen name="Categories/t-shirt" options={{ title: "back" }} />
      <Stack.Screen name="Categories/sweatshirt" options={{ title: "back" }} />
      <Stack.Screen name="Categories/wedding" options={{ title: "back" }} />
      <Stack.Screen name="Preview"  />
      <Stack.Screen name="UpdateItem"  />

      </Stack>
  );
}

export default Layout;