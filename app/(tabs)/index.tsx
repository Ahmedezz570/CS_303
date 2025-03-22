import { View, Text, TouchableOpacity, TextInput,Image, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import Data from '../data.js';

const categories = [
  { name: "Mobiles", image: require("../../assets/images/1311208664.png") },
  { name: "pants", image: require("../../assets/images/ba1.png") },
  { name: "dresses", image: require("../../assets/images/dress2.png") },
  { name: "jackets", image: require("../../assets/images/jacet1.png") },
  { name: "t-shirt", image: require("../../assets/images/te1.png") },
  { name: "sweatshirt", image: require("../../assets/images/sw1.png") },
  { name: "wedding", image: require("../../assets/images/we1.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },
  // { name: "Fashion", image: require("../../assets/images/ba4.png") },

];

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState(Data);

  return (
    
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.title}>Home page </Text>
        <TextInput
          placeholder="🔍 Search..."
          style={styles.input}
          onChangeText={(text) =>
            setData(Data.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())))
          }
        />
      </View>

      <View style={styles.row}>
          <Text style={styles.header}>Categories</Text>

          {/* <TouchableOpacity onPress={() => router.push("../Categories/seeAll")}>
              <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}>➡️</Text>
              </Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
              <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}></Text></Text>
          </TouchableOpacity>

       </View>
      


      <FlatList
      data={categories}
      horizontal
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => {
            if (item.name === "Mobiles") {
              router.push("../Categories/mobile");

            } else if (item.name === "pants") {
              router.push("../Categories/pants");

            } else if (item.name === "jackets") {
              router.push("../Categories/jackets");

            } else if (item.name === "dresses") {
              router.push("../Categories/dresses");

            } else if (item.name === "t-shirt") {
              router.push("../Categories/t-shirt");

            }else if (item.name === "wedding") {
              router.push("../Categories/wedding");
            }
            else if (item.name === "sweatshirt") {
              router.push("../Categories/sweatshirt");
            }
            // else if (item.name === "see all") {
            //   router.push("../Categories/sweatshirt");
            // }
          }}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  )}
  showsHorizontalScrollIndicator={false}
  style={[styles.flatList]} 
  />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 17,
  },
  searchBox: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10,
    alignItems: 'center', 
  },
  header: {
    // flex: ,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,

  },
  all:{

    textAlign: "right",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
    textDecorationLine: "underline", 

  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15, 
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    textAlign: "center",
    marginTop: 5,
  },
  
  flatList: {
    height: 10, 
    marginVertical: 10,
    // backgroundColor: "red",
    borderRadius: 20,}  
  
});
