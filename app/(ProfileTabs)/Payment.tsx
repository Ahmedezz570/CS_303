import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Payment = () => {
  return (
    <>
    <Stack.Screen name="Payment" options={{headerShown:false}} />
    <View style={styles.container}>
        <TouchableOpacity style={{ position: "absolute", top: 70, left: 30 }} onPress={() => { router.push('../(tabs)/profile') }}>
          <Image source={require('../../assets/images/backbutton.png')} style={styles.back} />
        </TouchableOpacity>
      <Text style={styles.text}>Payment</Text>
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
});
export default Payment