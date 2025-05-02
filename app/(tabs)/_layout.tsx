import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
         screenOptions={{
           headerShown: false,
           tabBarActiveTintColor: '#007AFF', 
           tabBarInactiveTintColor: '#8e8e93', 
           tabBarStyle: {
             backgroundColor: '#ffffff', 
             borderTopLeftRadius: 20,
             borderTopRightRadius: 20,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: -3 },
             shadowOpacity: 0.1,
             shadowRadius: 5,
             elevation: 10,
             height: 53,
           },
           tabBarLabelStyle: {
             fontSize: 12,
             fontWeight: '600',
           },
         }}
       >
    <Tabs.Screen name='home' options={{
      title: 'Home',
      tabBarIcon: ({color}) => (
        <Ionicons name='home-outline' size={22} color={color} />
      )
    }} />
            <Tabs.Screen name='products' options={{
      title: 'Products',
      tabBarIcon: ({ color }) => (
        <Ionicons name='pricetags-outline' size={22} color={color} />
      )
    }} />
    <Tabs.Screen name='notifications' options={{
      title: 'Notification',
      tabBarIcon: ({color}) => (
        <Ionicons name='notifications-outline' size={22} color={color} />
      )
    }} />
    
    <Tabs.Screen name='cart' options={{
      title: 'Cart',
      tabBarIcon: ({color}) => (
        <Ionicons name='cart-outline' size={22} color={color} />
      )
    }} />
    <Tabs.Screen name='profile' options={{
      title: 'Profile',
      tabBarIcon: ({color}) => (
        <Ionicons name='person-outline' size={22} color={color} />
      )
    }} />
    <Tabs.Screen name='About' options={{
      title: 'About',
      tabBarIcon: ({color}) => (
        <Ionicons name='information-circle-outline' size={22} color={color} />
      )
    }} />

  </Tabs>
  );
}