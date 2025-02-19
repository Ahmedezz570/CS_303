import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={require('../assets/images/pngwing.com.png')} style={styles.logo} />
          <Text style={styles.title}>SUPERMALL</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/Login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FAE5D3',
    paddingHorizontal: 20,
  },
  content: {
    bottom : 50,
    alignItems: 'center', 
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#4A3222',
    marginTop: 10,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  button: {
    position: 'absolute',
    bottom: 50, 
    backgroundColor: '#6F4E37',
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
