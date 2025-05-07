import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { auth, db } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import MiniAlert from './(ProfileTabs)/MiniAlert';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setAlertMessage('Please fill all fields');
      setAlertType('error');
      return;
    }
    if (password.length < 6) {
      setAlertMessage('Password must be at least 6 characters');
      setAlertType('error');
      return;
    }

    setLoading(true);

    try {
      const createUser = await createUserWithEmailAndPassword(auth, email, password);
      const user = createUser.user;

      await setDoc(doc(db, "Users", user.uid), {
        username,
        email: email.trim(),
        uid: user.uid,
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        isAdmin: false,
        isBlocked: false,
      });

      setAlertMessage('Account created successfully!');
      setAlertType('success');

      setTimeout(() => {
        router.replace('/Login');
      }, 1500);
    } catch (error) {
      setAlertMessage('Invalid email or password');
      setAlertType('error');
    }
    setLoading(false);
  }

  const back = () => {
    router.replace('/Login');
  }

  const reset = () => {
    router.push('/ForgetPass');
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

        <Text style={styles.title}>Create Account</Text>
        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Email Address" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.semif}>
          <Text style={styles.text}>Forgot Password?</Text>
          <TouchableOpacity style={styles.createButton} onPress={reset}>
            <Text style={styles.createButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    minHeight: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    marginBottom: Dimensions.get('window').height * 0.02,


    width: '95%',
    alignSelf: 'center',
  },
  input: {
    width: '95%',
    height: 40,
    backgroundColor: 'rgb(226, 226, 226)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: Dimensions.get('window').height * 0.01,
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
  text: {
    marginTop: Dimensions.get('window').height * 0.015,
  },
  createButton: {
    marginTop: Dimensions.get('window').height * 0.015,
  },
  createButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },

  semif: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: Dimensions.get('window').height * 0.01,
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

});
