import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../Firebase/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import MiniAlert from './(ProfileTabs)/MiniAlert';

const ForgetPass = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const handleResetPassword = async () => {
    if (!email) {
      setAlertMessage('Please enter your email');
      setAlertType('error');
      return;
    }
    setLoading(true);

    try {
      await fetchSignInMethodsForEmail(auth, email);
      const q = query(collection(db, 'Users'), where('email', '==', email))
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await sendPasswordResetEmail(auth, email);
        setAlertMessage('Reset password link sent to your email');
        setAlertType('success');

        setTimeout(() => {
          router.replace('/Login');
        }, 1500);
      } else {
        setAlertMessage('Email doesn\'t exist');
        setAlertType('error');
      }
    } catch (err) {
      if (err instanceof Error && err.message === "Firebase: Error (auth/invalid-email).") {
        setAlertMessage('Wrong format of email');
      } else {
        setAlertMessage(err instanceof Error && err.message || 'An error occurred');
      }
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    router.back();
  }

  return (
    <View style={styles.fl}>
      {alertMessage && (
        <MiniAlert
          message={alertMessage}
          type={alertType}
          onHide={() => setAlertMessage(null)}
        />
      )}

      <View style={styles.container}>
        <TouchableOpacity style={styles.backbut} onPress={back}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Sending reset email...</Text>
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
    paddingLeft: 5,
    marginLeft: '2.5%',
    alignSelf: "flex-start",
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: 'rgb(231, 227, 227)',
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


