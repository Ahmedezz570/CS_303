import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const support = () => {
  return (
    <>
      <Stack.Screen name="support" options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { router.back() }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.text}>support</Text>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAE5D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: "green",
  },
  back: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
});
export default support