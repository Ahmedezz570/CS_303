import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
const Login = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        router.push('/(tabs)');
      }}>
        <Text>Click Here</Text>
      </TouchableOpacity>
  </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default Login;
