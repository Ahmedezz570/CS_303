import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { auth, getUserData } from '../../Firebase/Firebase';
import MiniAlert from '../(ProfileTabs)/MiniAlert';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

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

  return (
    <>
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
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
        <Image source={userData?.image ? { uri: userData?.image } : { uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.logo} />

        <View style={styles.infobox}>
          <View style={styles.info}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.name}>
                {(String(userData?.username).toUpperCase()) == "UNDEFINED" ? "Please Login..." : String(userData?.username).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.mail}>
              {(String(userData?.email).toLowerCase()) == "undefined" ? "Please Login..." : String(auth.currentUser?.email).toLowerCase()}
            </Text>
            <Text style={styles.mail}>
              {userData?.phone}
            </Text>
          </View>
          <View style={styles.edit}>
            <TouchableOpacity
              style={{ width: 60, height: 35, padding: 5 }}
              onPress={() => {
                router.push('../(ProfileTabs)/editprofile');
              }}
              activeOpacity={0.4}
            >
              <Text style={styles.edittext}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profiletabs}
          onPress={() => {
            router.push('../(ProfileTabs)/orders');
          }}
          activeOpacity={0.6}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textb}>Orders</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/backtab.png")}
              style={styles.backtab}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profiletabs}
          onPress={() => {
            router.push('../(ProfileTabs)/address');
          }}
          activeOpacity={0.6}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textb}>Address</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/backtab.png")}
              style={styles.backtab}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profiletabs}
          onPress={() => {
            router.push('../(ProfileTabs)/Wishlist');
          }}
          activeOpacity={0.6}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textb}>Wishlist</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/backtab.png")}
              style={styles.backtab}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profiletabs}
          onPress={() => {
            router.push('../(ProfileTabs)/Payment');
          }}
          activeOpacity={0.6}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textb}>Payment</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/backtab.png")}
              style={styles.backtab}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profiletabs}
          onPress={() => {
            router.push('../(ProfileTabs)/help');
          }}
          activeOpacity={0.6}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textb}>Help & Support</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/backtab.png")}
              style={styles.backtab}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.out}
            onPress={() => {
              auth.signOut();
              setAlertMessage("باي باي 👋 \nهتوحشنا 🤍");
              setAlertType("error");
              setTimeout(() => {
                router.replace("../Login");
              }, 3000);
            }}
            activeOpacity={0.4}
          >
            <Text style={{ fontSize: 20, color: "darkred", fontWeight: "bold" }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAE5D3',
  },
  backtab: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 15,
    top: 11,
  },
  profiletabs: {
    backgroundColor: 'white',
    width: '90%',
    height: 53,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    marginBottom: 12,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  textb: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingTop: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: 80,
  },
  infobox: {
    width: "90%",
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    elevation: 1,
  },
  info: {
    padding: 4,
    flex: 1,
  },
  edit: {
    flex: 1,
    alignSelf: "center",
    position: "absolute",
    right: 15,
  },
  edittext: {
    display: 'flex',
    justifyContent: "flex-end",
    color: 'purple',
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "purple",
    borderWidth: 1.9,
    borderRadius: 10,
    borderStyle: "dashed",
    width: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  mail: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  out: {
    position: "absolute",
    bottom: 30,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 3,
    width: 150,
    elevation: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;

