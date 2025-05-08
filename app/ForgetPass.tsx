
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../Firebase/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
const ForgetPass = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true); 

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      const q = query(collection(db, 'Users'), where('email', '==', email))
      const querySnapshot = await getDocs(q);

      if (! querySnapshot.empty) {
        await sendPasswordResetEmail(auth, email);
        Alert.alert("Success", "Reset password link sent to your email");
      } else {
        Alert.alert("Error", "Email doesn't exist");
      }
    } catch (err) {
     if(err.message==="Firebase: Error (auth/invalid-email)."){
      Alert.alert("Error","wrong format of email");}
      else{
        Alert.alert("Error",err.message);
      }
    } finally {
      setLoading(false); 
    }
  };

  const back = () => {
    router.replace('/Register');
  }

  return (
    <View style={styles.fl}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backbut} onPress={back}>
        <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput placeholder="Email Address" style={styles.input} value={email}
          onChangeText={setEmail} />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>continue</Text>
        </TouchableOpacity>
     
      </View>
      {loading && (
               <View style={styles.loadingOverlay}>
                 <ActivityIndicator size="large" color="white" />
                 <Text style={styles.loadingText}>Creating your account...</Text>
               </View>
             )}
    </View>
  )
}

export default ForgetPass
const styles = StyleSheet.create({
  container: {
    width: '98%',
    minHeight: Dimensions.get('window').height * 0.3,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '95%',
    height: 53,
    borderRadius: 100,
    backgroundColor: 'rgb(247, 207, 174)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.01,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    width: '95%',
    height: 40,
    backgroundColor: 'rgb(226, 226, 226)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: Dimensions.get('window').height * 0.01,

  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    marginBottom: Dimensions.get('window').height * 0.02,

    width: '95%',
    alignSelf: 'center',
  },
  backbut: {
    paddingTop: 4,
    paddingLeft:5, 
    marginLeft:'2.5%',
     alignSelf:"flex-start",
     width:35,
     height:35,
     borderRadius:50,
     backgroundColor:'rgb(231, 227, 227)',
  },
  fl: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})


