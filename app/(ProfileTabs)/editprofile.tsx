import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { auth, getUserData } from '../../Firebase/Firebase';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const editprofile = () => {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    else {
      setImage(null);
    }
  };
  const [userData, setUserData] = useState<any>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [num, setNum] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);



  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  async function Update() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const docRef = doc(db, "Users", currentUser?.uid);
      if (username != null || "") {
        await updateDoc(docRef, {
          username: username,
        });
      }
      if (num != null || "") {
        await updateDoc(docRef, {
          phone: num,
        });
      }
      if (fullname != null || "") {
        await updateDoc(docRef, {
          fullname: fullname,
        });
      }
      if (email != null || "") {
        if (password != null || "") {
          await updateDoc(docRef, {
            email: email,
          });
          updateEmail(currentUser, String(email)).then(() => { }).catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
              const credential = EmailAuthProvider.credential(String(auth.currentUser?.email), String(password));
              reauthenticateWithCredential(currentUser, credential).then(() => {
                updateEmail(currentUser, String(email)).then(() => { })
              })
            }
          });
        }
        else {
          alert("Please Enter Your Password");
        }
      }
      alert("Thanks For Updates ✨")
      router.push("../(tabs)/profile")
    } else {
      alert("No user is currently logged in.");
      router.push("../Login")
    }
  }

  return (
    <>
      <Stack.Screen name="address" options={{ headerShown: false, }} />
      <View style={styles.container}>
        <TouchableOpacity style={{ position: "absolute", top: 40, left: 30 }} onPress={() => { router.push('../(tabs)/profile') }}>
          <Image source={require('../../assets/images/backbutton.png')} style={styles.back} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', top: 110, }} onPress={pickImage}>
          <Image source={image ? { uri: image } : { uri: userData?.image }} style={styles.logo} />
          <Image source={require('../../assets/images/logoedit.png')} style={{ position: "absolute", bottom: 0, opacity: 0.7 }} />
        </TouchableOpacity>
        <View style={{ position: "absolute", width: "100%", top: 240, alignItems: "flex-start", display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>
          <View>
            <View>
              <Text style={styles.text}> Username</Text>
              <TextInput style={styles.inputbox} placeholder={String(userData?.username).toUpperCase()} onChangeText={(text) => { setUsername(text); }} />
            </View>

            <View>
              <Text style={styles.text}> Phone Number</Text>
              <TextInput style={styles.inputbox} placeholder={userData?.phone} keyboardType="number-pad" onChangeText={(text) => { setNum(text); }} />
            </View>


          </View>

          <View>
            <View>
              <Text style={styles.text}> Full Name</Text>
              <TextInput style={styles.inputbox} placeholder={userData?.fullname} keyboardType="email-address" onChangeText={(text) => { setFullname(text); }} />
            </View>


          </View>
        </View>

        <View style={{ position: "absolute", width: "97%", top: 415, alignItems: "flex-start", display: 'flex', flexDirection: 'row', justifyContent: "space-around", borderWidth: 2, borderColor: "black", borderRadius: 10, padding: 5 }}>
          <View>
            <Text style={styles.text}> Email</Text>
            <TextInput style={styles.inputbox} placeholder={String(auth.currentUser?.email).toLowerCase()} keyboardType="email-address" onChangeText={(text) => { setEmail(text); }} />
          </View>

          <View>
            <Text style={styles.text}> *Current Password</Text>
            <TextInput style={styles.inputbox} placeholder='✪✪✪✪✪✪✪✪✪✪' keyboardType="visible-password" onChangeText={(text) => { setPassword(text); }} />
          </View>

        </View>

        <TouchableOpacity onPress={() => { Update() }} style={{ position: 'absolute', top: Dimensions.get('window').height - 120 }}>
          <View>
            <Image source={require("../../assets/images/confirm.png")} style={styles.confirm} />
            <Image source={require("../../assets/images/save.png")} style={styles.save} />
            <Text style={styles.savetext}>Save Changes</Text>
          </View>
        </TouchableOpacity>
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
  savetext: {
    position: "absolute",
    top: 25,
    left: 78,
    fontSize: 18,
    fontWeight: "bold",
    color: "gold",
  },
  save: {
    position: "absolute",
    width: 40,
    height: 40,
    top: 16,
    left: 23,
  },
  confirm: {
    width: 210,
    height: 72.5,
  },
  inputbox: {
    height: 40,
    width: (Dimensions.get('window').width / 2.5) + 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'silver',
    shadowColor: '#000',
    elevation: 10,
    marginBottom: 20,
  },
  gender: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "silver",
    height: 40,
    width: 150,
    elevation: 10,
  },
  back: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 4,
    borderColor: "#674ea7",
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
})
export default editprofile