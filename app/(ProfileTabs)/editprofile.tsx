import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { auth, getUserData } from '../../Firebase/Firebase';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import MiniAlert from '../(ProfileTabs)/MiniAlert';


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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const IMGBB_API_KEY = "5f368fdc294d3cd3ddc0b0e9297a10fb";



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
  const uploadImageToImgbb = async (uri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
  
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    const data = await response.json();
    return data.data.url;
  };
  
  async function Update() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const docRef = doc(db, "Users", currentUser?.uid);
      if (image) {
      const imageUrl = await uploadImageToImgbb(image);
      await updateDoc(docRef, {
        image: imageUrl,
      });
    }
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
      setAlertMessage("تم تحديث البيانات بنجاح");
      setAlertType("success");
      setTimeout(() => {
        router.replace("../(tabs)/profile");
      }, 3000);
    } else {
      setAlertMessage("لا يوجد مستخدم مسجل الدخول حاليا");
      setAlertType("error");
      setTimeout(() => {
        router.replace("../Login");
      }, 3000);
    }
  }

  return (
    <>
      <Stack.Screen name="address" options={{ headerShown: false, }} />
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