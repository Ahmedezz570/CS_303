import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Pressable, TextInput, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

import Data from '../data.js';
import Item from '../item/item';

const categories = [
  { name: "Mobile", image: require("../../assets/images/1311208664.png") },
  { name: "pants", image: require("../../assets/images/ba1.png") },
  { name: "dresses", image: require("../../assets/images/dress2.png") },
  { name: "jackets", image: require("../../assets/images/jacet1.png") },
  { name: "t-shirt", image: require("../../assets/images/te1.png") },
  { name: "sweatshirt", image: require("../../assets/images/sw1.png") },
  { name: "wedding", image: require("../../assets/images/we1.png") },
];
const Home = () => {
  const [productData, setProductData] = useState(Data);
  const [filteredData, setFilteredData] = useState(Data); 
  const router = useRouter();


  const handleSearch = (text: string) => {
    const filtered = Data.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.text}>Discover</Text>

      <View style={styles.icons}>
        <Pressable onPress={() => router.push('/profile')}>
          <FontAwesome name="user" size={30} color="white" style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => router.push('/cart')}>
          <FontAwesome6 name="bucket" size={24} color="black" style={styles.icon} />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          style={styles.input}
          onChangeText={handleSearch} 
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>all Categories</Text>
        <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
          <Text style={styles.text}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push(`../Categories/${item.name.toLowerCase()}`)}
          >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.text}>Suggested for you</Text>
      <FlatList
        data={filteredData} // استخدام البيانات المفلترة
        renderItem={({ item }) => <Item item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View>
        <Text style={styles.text}>Top Selling</Text>
        <FlatList
          data={filteredData} // استخدام البيانات المفلترة
          renderItem={({ item }) => <Item item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

// const Home = () => {
//   const [productData, setProductData] = useState(Data);
//   const router = useRouter();

//   return (
//     <ScrollView 
//       style={styles.container} 
//       contentContainerStyle={{ paddingBottom: 20 }} // يخلي الصفحة كلها قابلة للسكرول
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.text}>Discover</Text>

//       <View style={styles.icons}>
//         <Pressable onPress={() => router.push('/profile')}>
//           <FontAwesome name="user" size={30} color="white" style={styles.icon} />
//         </Pressable>
//         <Pressable onPress={() => router.push('/cart')}>
//           <FontAwesome6 name="bucket" size={24} color="black" style={styles.icon} />
//         </Pressable>
//       </View>

//       <View style={styles.searchBar}>
//         <FontAwesome name="search" size={20} style={styles.searchIcon} />
//         <TextInput placeholder="Search" style={styles.input} />
//       </View>

//       <View style={styles.row}>
//         <Text style={styles.text}>Categories</Text>
//         <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
//           <Text style={styles.text}>See All</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={categories}
//         horizontal
//         keyExtractor={(item) => item.name}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.categoryItem}
//             onPress={() => router.push(`../Categories/${item.name.toLowerCase()}`)}
//           >
//             <Image source={item.image} style={styles.categoryImage} />
//             <Text style={styles.categoryText}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//         showsHorizontalScrollIndicator={false}
//       />
// <Text style={styles.text}>Suggested for you</Text>
//       <FlatList
//         data={productData}
//         renderItem={({ item }) => <Item item={item} />}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />

//       <View>
//         <Text style={styles.text}>Top Selling</Text>
//         <FlatList
//           data={productData}
//           renderItem={({ item }) => <Item item={item} />}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//     </ScrollView>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1, 
   backgroundColor: '#FAE5D3', 
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  icon: {
    backgroundColor: "gray",
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    padding: 8,
    fontSize: 20,
    color: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 19,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  all: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  text: {
    marginTop: 10,
    fontSize: 30,
    fontFamily: "cursive",
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 19,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "gray",
  },
  categoryText: {
    textAlign: "center",
    marginTop: 5,
  },
});

export default Home;
