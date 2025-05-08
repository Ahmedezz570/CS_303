import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, getUserData } from '../Firebase/Firebase';
import { getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MiniAlert from './(ProfileTabs)/MiniAlert';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
 const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();
  const signin = async () => {
    setError('');
    if (!email || !password) {
      setAlertMessage('Please fill all fields');
      setAlertType('error');
      return;
    }
    setLoading(true);
    try {
      const getUser = await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("User:", user);
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      
     
      if (userDoc.exists()) {
        const data = await getUserData(user.uid);
        console.log(data?.isAdmin);
        console.log(data?.preferredCategories);
        const newCategories = data?.preferredCategories;
        console.log(newCategories);
        setSelectedCategories(newCategories);
        console.log("Selected Categories (direct):", newCategories);
        await AsyncStorage.setItem('DataForUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          isAdmin: data?.isAdmin || false,
        }));

        if (data?.isAdmin === true) {
          setAlertMessage('Welcome Admin!');
          setAlertType('success');
          setTimeout(() => {
            router.replace('./Admintabs');
            router.push('./Admintabs/Admin');
          }, 1500);
        }
        else {
          setAlertMessage('Welcome back! Login successful');
          setAlertType('success');
          setTimeout(() => {
            router.replace({
              pathname: '/(tabs)/',
             
            });
            router.push({pathname:'/home',
              params: { categories: JSON.stringify(newCategories) }}
            );
          }, 1500);
        }
      } else {
        setError('User not found.');
        setAlertMessage('User not found');
        setAlertType('error');
      }

    } catch (error) {
      setError('Invalid email or password.');
      setAlertMessage('Invalid email or password');
      setAlertType('error');
    }
    setLoading(false);
  }

  const reg = () => {
    router.push('/Register');
  }
  return (
    <View style={styles.fl}>
      {
        alertMessage && (
          <MiniAlert
            message={alertMessage}
            type={alertType}
            onHide={() => setAlertMessage(null)}
          />
        )
      }
      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />


        <TouchableOpacity style={styles.button} onPress={signin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.semif}>

          <Text style={styles.text}>Don't have an account?</Text>

          <TouchableOpacity style={styles.createButton} onPress={reg}>
            <Text style={styles.createButtonText}>Create One</Text>

          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button1} >
          <FontAwesome name='google' size={30} style={styles.icon}></FontAwesome>

          <Text style={styles.button1text}>Continue With Google</Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} >
          <FontAwesome name='facebook' color='white' size={25} style={styles.faceicon}></FontAwesome>

          <Text style={styles.button1text}>Continue With Facebook</Text>

        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {

    width: '98%',
    minHeight: Dimensions.get('window').height * 0.8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    marginBottom: 20,

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
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 53,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    backgroundColor: 'rgb(236, 235, 235)',
    position: 'relative',

    marginTop: Dimensions.get('window').height * 0.01,

  },
  button1a: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 53,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    backgroundColor: 'rgb(236, 235, 235)',
    position: 'relative',

    marginTop: Dimensions.get('window').height * 0.06,

  },
  button1text: {
    color: 'black',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    marginTop: Dimensions.get('window').height * 0.02,
  },
  createButton: {
    marginTop: Dimensions.get('window').height * 0.02,
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
    marginTop: Dimensions.get('window').height * 0.005,

  },
  fl: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    left: '3%',
  },
  faceicon: {
    position: 'absolute',
    left: '3%',

    borderRadius: 50,
    width: 35,
    height: 35,
    backgroundColor: 'rgb(24, 119, 242)',

    textAlign: 'center',
    textAlignVertical: 'center',

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

