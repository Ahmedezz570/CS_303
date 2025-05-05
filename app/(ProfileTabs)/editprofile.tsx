import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, getUserData } from '../../Firebase/Firebase';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import MiniAlert from '../(ProfileTabs)/MiniAlert';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { useRef } from 'react';




const editprofile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [num, setNum] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const IMGBB_API_KEY = "5f368fdc294d3cd3ddc0b0e9297a10fb";

  const actionSheetRef = useRef<any>(null);

  const showImageOptions = () => {
    actionSheetRef.current?.show();
  };

  const handleActionSheet = async (index: number) => {
    if (index === 0) {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to allow camera access to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }else { setImage(null); }
    } else if (index === 1) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else { setImage(null); }
    }
  };


  const SaveButton = ({ onPress }: { onPress: () => void }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={() => { Update() }}>
        <View style={styles.iconContainer}>
          <View style={styles.iconTab} />
          <View style={styles.iconCircle}>
            <Svg width={30} height={30} viewBox="0 0 24 24">
              <Path
                d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                stroke="black"
                strokeWidth={2}
                fill="none"
              />
              <Rect x="7" y="3" width="6" height="5" stroke="black" strokeWidth={2} fill="none" />
              <Path d="M9 17h6" stroke="black" strokeWidth={2} />
            </Svg>
          </View>
        </View>
        <Text style={styles.text1}>Save Changes</Text>
      </TouchableOpacity>
    );
  };

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
      setAlertMessage("Update Successfully");
      setAlertType("success");
      setTimeout(() => {
        router.replace("../(tabs)/profile");
      }, 3000);
    } else {
      setAlertMessage("No User Is Currently Logged In");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { router.back() }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', top: 110, }} onPress={showImageOptions}>
          <Image source={image ? { uri: image } : { uri: userData?.image }} style={styles.logo} />
          <Text style={styles.edit}>EDIT</Text>
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
        <SaveButton onPress={() => console.log("Saved!")} />
        <ActionSheet
          ref={actionSheetRef}
          title={"Choose An Option"}
          options={['Take By Camera 📷', 'From Gallery 🖼️',"Cancel"]}
          cancelButtonIndex={2}
          onPress={handleActionSheet}
        />

      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  edit: {
    width: 110,
    height: 50,
    backgroundColor: "#7e57c2",
    borderColor: "#7e57c2",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    textAlign: "center",
    lineHeight: 40,
    color: "white",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    fontSize: 17,
    opacity: 0.7,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#22b5e2',
    borderRadius: 50,
    elevation: 4,
    position: 'absolute',
    top: Dimensions.get('window').height - 120
  },
  iconContainer: {
    position: 'relative',
    marginRight: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  iconTab: {
    position: 'absolute',
    top: -10,
    left: 24,
    width: 12,
    height: 20,
    borderRadius: 3,
    backgroundColor: 'white',
    zIndex: 1,
  },
  text1: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 18,
  },
})
export default editprofile