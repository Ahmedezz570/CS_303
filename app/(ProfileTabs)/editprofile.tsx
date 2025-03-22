import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, Switch } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
const editprofile = () => {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <>
      <Stack.Screen name="address" options={{ headerShown: false, }} />
      <View style={styles.container}>
        <TouchableOpacity style={{ position: "absolute", top: 70, left: 30 }} onPress={() => { router.push('../(tabs)/profile') }}>
          <Image source={require('../../assets/images/backbutton.png')} style={styles.back} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', top: 160, }} onPress={pickImage}>
          <Image source={image ? { uri: image } : require('../../assets/images/profile.jpg')} style={styles.logo} />
          <Image source={require('../../assets/images/logoedit.png')} style={{ position: "absolute", bottom: 0 ,opacity:0.7}} />
        </TouchableOpacity>



        <View style={{ position: "absolute", width: "100%", top: 300, alignItems: "flex-start", display: 'flex', flexDirection: 'row', justifyContent: "space-around" }}>


          <View>
            <View>
              <Text style={styles.text}> Display name</Text>
              <TextInput style={styles.inputbox} placeholder='Anas Gamal Kamel' />
            </View>

            <View>
              <Text style={styles.text}> Email</Text>
              <TextInput style={styles.inputbox} placeholder='anslahga@gmail.com' keyboardType="email-address" />
            </View>


            <View>
              <Text style={styles.text}> Change Password</Text>
              <TextInput style={styles.inputbox} placeholder='✪✪✪✪✪✪✪✪✪✪' keyboardType="visible-password"/>
            </View>
          </View>


          <View>
            <View>
              <Text style={styles.text}> Username</Text>
              <TextInput style={styles.inputbox} placeholder='ANAS' />
            </View>

            <View>
              <Text style={styles.text}> Phone Number</Text>
              <TextInput style={styles.inputbox} placeholder='01032672532' keyboardType="number-pad" />
            </View>



          </View>


        </View>



        <TouchableOpacity onPress={() => { alert("Thanks For Updates ✨"), router.push("../(tabs)/profile") }} style={{ position: 'absolute', top: Dimensions.get('window').height - 120 }}>
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
    width: Dimensions.get('window').width / 2.5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'silver',
    shadowColor: '#000',
    elevation: 10,
    marginBottom: 20,
  },
  gender:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:1,
    borderRadius:10,
    backgroundColor:"silver",
    height:40,
    width:150,
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