import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='Admin' options={{
        title: 'Admin',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="admin-panel-settings" size={24} color="black" />
        ),
        headerShown: false
      }} />
      <Tabs.Screen name='Users' options={{
        title: 'Users',
        tabBarIcon: ({ color }) => (
          <FontAwesome6 name="users-gear" size={24} color="black" />
        ),
        headerShown: false
      }} />
      <Tabs.Screen name='AddProduct' options={{
        title: 'Add Product',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="add-to-photos" size={24} color="black" />
        ),
        headerShown: false
      }} />
      <Tabs.Screen name='Products' options={{
        title: 'Products',
        tabBarIcon: ({ color }) => (
          <Ionicons name="pricetags-sharp" size={24} color="black" />
        ),
        headerShown: false
      }} />
      <Tabs.Screen name='Order' options={{
        title: 'Order',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="order-bool-descending-variant" size={24} color="black" />
        ),
        headerShown: false
      }} />
    </Tabs>
  );
}