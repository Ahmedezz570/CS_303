import { Stack } from 'expo-router';
import React from 'react';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="home"  options={{headerShown:false}}/>
      <Stack.Screen name="Login"  options={{headerShown:false}}/>
      <Stack.Screen name="Register"   options={{headerShown:false}}/>
     <Stack.Screen name="ForgetPass" options={{headerShown:false}} />
      {/* <Stack.Screen name="About"  /> */}
      <Stack.Screen name="singlepage"   options={{ headerShown: false }} 

 />
      </Stack>
  );
}

export default Layout;