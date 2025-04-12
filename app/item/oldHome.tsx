// import { View, Text, TouchableOpacity, TextInput,Image, FlatList, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState } from 'react';
// import Data from '../data.js';

// const categories = [
//   { name: "Mobiles", image: require("../../assets/images/1311208664.png") },
//   { name: "pants", image: require("../../assets/images/ba1.png") },
//   { name: "dresses", image: require("../../assets/images/dress2.png") },
//   { name: "jackets", image: require("../../assets/images/jacet1.png") },
//   { name: "t-shirt", image: require("../../assets/images/te1.png") },
//   { name: "sweatshirt", image: require("../../assets/images/sw1.png") },
//   { name: "wedding", image: require("../../assets/images/we1.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },
//   // { name: "Fashion", image: require("../../assets/images/ba4.png") },

// ];

// export default function Home() {
//   const router = useRouter();
//   const [data, setData] = useState(Data);

//   return (
    
//     <View style={styles.container}>
//       <View style={styles.searchBox}>
//         <Text style={styles.title}>Home page </Text>
//         <TextInput
//           placeholder="🔍 Search..."
//           style={styles.input}
//           onChangeText={(text) =>
//             setData(Data.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())))
//           }
//         />
//       </View>

//       <View style={styles.row}>
//           <Text style={styles.header}>Categories</Text>

//           {/* <TouchableOpacity onPress={() => router.push("../Categories/seeAll")}>
//               <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}>➡️</Text>
//               </Text>
//           </TouchableOpacity> */}
//           <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
//               <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}></Text></Text>
//           </TouchableOpacity>

//        </View>
      


//       <FlatList
//       data={categories}
//       horizontal
//       keyExtractor={(item) => item.name}
//       renderItem={({ item }) => (
//         <TouchableOpacity
//           style={styles.categoryItem}
//           onPress={() => {
//             if (item.name === "Mobiles") {
//               router.push("../Categories/mobile");

//             } else if (item.name === "pants") {
//               router.push("../Categories/pants");

//             } else if (item.name === "jackets") {
//               router.push("../Categories/jackets");

//             } else if (item.name === "dresses") {
//               router.push("../Categories/dresses");

//             } else if (item.name === "t-shirt") {
//               router.push("../Categories/t-shirt");

//             }else if (item.name === "wedding") {
//               router.push("../Categories/wedding");
//             }
//             else if (item.name === "sweatshirt") {
//               router.push("../Categories/sweatshirt");
//             }
//             // else if (item.name === "see all") {
//             //   router.push("../Categories/sweatshirt");
//             // }
//           }}
//     >
//       <Image source={item.image} style={styles.categoryImage} />
//       <Text style={styles.categoryText}>{item.name}</Text>
//     </TouchableOpacity>
//   )}
//   showsHorizontalScrollIndicator={false}
//   style={[styles.flatList]} 
//   />


//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 2,
//     padding: 17,
//   },
//   searchBox: {
//     backgroundColor: '#fff',
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: 'black',
//   },
//   input: {
//     width: '90%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#000',
//     paddingHorizontal: 10,
//     borderRadius: 25,
//     backgroundColor: '#ffffff',
//   },
//   row: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     padding: 10,
//     alignItems: 'center', 
//   },
//   header: {
//     // flex: ,
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     marginTop: 5,

//   },
//   all:{

//     textAlign: "right",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     marginTop: 5,
//     textDecorationLine: "underline", 

//   },
//   categoryItem: {
//     alignItems: "center",
//     marginRight: 15, 
//   },
//   categoryImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//   },
//   categoryText: {
//     textAlign: "center",
//     marginTop: 5,
//   },
  
//   flatList: {
//     height: 10, 
//     marginVertical: 10,
//     // backgroundColor: "red",
//     borderRadius: 20,}  
  
// });

// import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, TextInput, FlatList, Alert, Dimensions } from 'react-native';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { FontAwesome } from '@expo/vector-icons';
// import { FontAwesome6 } from '@expo/vector-icons';
// import data from '../data';
// import Data from '../data.js';
// import Item from '../item/item';

// const categories = [
//   { name: "Mobiles", image: require("../../assets/images/1311208664.png") },
//   { name: "pants", image: require("../../assets/images/ba1.png") },
//   { name: "dresses", image: require("../../assets/images/dress2.png") },
//   { name: "jackets", image: require("../../assets/images/jacet1.png") },
//   { name: "t-shirt", image: require("../../assets/images/te1.png") },
//   { name: "sweatshirt", image: require("../../assets/images/sw1.png") },
//   { name: "wedding", image: require("../../assets/images/we1.png") },
// ];

// const { width } = Dimensions.get("window");

// const Home = () => {
//   const [data, setData] = useState(Data);
//   const router = useRouter();

//   const renderItem = ({ item }: { item: any }) => {
//     return <Item item={item} />;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Discover</Text>

//       {/* أيقونات الحساب والسلة */}
//       <View style={styles.icons}>
//         <Pressable onPress={() => router.push('/profile')}>
//           <FontAwesome name="user" size={30} color="white" style={styles.icon} />
//         </Pressable>
//         <Pressable onPress={() => router.push('/cart')}>
//           <FontAwesome6 name="bucket" size={24} color="black" style={styles.icon} />
//         </Pressable>
//       </View>

//       {/* شريط البحث */}
//       <View style={styles.searchBar}>
//         <FontAwesome name="search" size={20} style={styles.searchIcon} />
//         <TextInput placeholder="Search" style={styles.input} />
//       </View>
//       <FlatList
//       {/* العنوان وزر "See All" */}
//       <View style={styles.row}>
//         <Text style={styles.header}>Categories</Text>
//         <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
//           <Text style={styles.all}>See All</Text>
//         </TouchableOpacity>
//       </View>

//       {/* قائمة الفئات */}
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

//       {/* قائمة المنتجات */}
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />

//       {/* قسم Top Selling */}
//       <View>
//         <Text style={styles.text}>Top Selling</Text>
//         <FlatList
//           data={data}
//           renderItem={renderItem}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />

// />
//       </View>
      
//     </View>
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // خليها 1 عشان تتمدد مع الشاشة بشكل صحيح
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   icons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '90%',
//     alignSelf: 'center',
//     marginTop: '5%',
//   },
//   icon: {
//     backgroundColor: "gray",
//     width: 40,
//     height: 40,
//     borderRadius: 40,
//     textAlign: 'center',
//     padding: 8,
//     fontSize: 20,
//     color: 'white',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     backgroundColor: 'lightgray',
//     width: '90%',
//     alignSelf: 'center',
//     marginTop: '5%',
//     borderRadius: 30,
//     padding: 10,
//     alignItems: 'center',
//   },
//   searchIcon: {
//     marginLeft: 10,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 19,
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   all: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 20,
//     fontFamily: "cursive",
// },
//   categoryItem: {
//     alignItems: "center",
//     marginRight: 19,
//   },
//   categoryImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     backgroundColor: "gray",
//   },
//   categoryText: {
//     textAlign: "center",
//     marginTop: 5,
//   },
// });

// export default Home;



// // import { View, Text,Image,TouchableOpacity, StyleSheet, Pressable, TextInput, FlatList, Alert, Dimensions } from 'react-native'
// // import { useRouter, router } from 'expo-router';
// // import React, { useState } from 'react';
// // import { FontAwesome } from '@expo/vector-icons';
// // import { FontAwesome6 } from '@expo/vector-icons';
// // import { SearchBar } from 'react-native-screens';
// // import data from '../data';
// // import Data from '../data.js';
// // import Item from '../item/item';


// // const categories = [
// //   { name: "Mobiles", image: require("../../assets/images/1311208664.png") },
// //   { name: "pants", image: require("../../assets/images/ba1.png") },
// //   { name: "dresses", image: require("../../assets/images/dress2.png") },
// //   { name: "jackets", image: require("../../assets/images/jacet1.png") },
// //   { name: "t-shirt", image: require("../../assets/images/te1.png") },
// //   { name: "sweatshirt", image: require("../../assets/images/sw1.png") },
// //   { name: "wedding", image: require("../../assets/images/we1.png") },
// // ];

// // const { width } = Dimensions.get("window");
// // const Home = () => {
// //   const [data, setData] = useState(Data);
// //   const router = useRouter();
// //   const renderItem = ({ item }: { item: any }) => {
// //     return (
// //       <Item
// //         item={item}>

// //       </Item>
// //     )
// //   }
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.text}> Discver </Text>
// //       <View style={styles.icons}>
// //         <Pressable onPress={() => router.push('/profile')}>
// //           <FontAwesome name="user" size={30} color="white" style={styles.icon} />
// //         </Pressable>
// //         <Pressable onPress={() => router.push('/cart')}>
// //           <FontAwesome6 name="bucket" size={24} color="black" style={styles.icon} />
// //         </Pressable>
// //       </View>
// //       <View style={styles.SearchBar}>
// //         <FontAwesome name='search' size={20} style={{ alignSelf: 'center', marginLeft: '3%' }} />
// //         <TextInput
// //           placeholder='Serach'
// //         />

// //       </View>


// //       <View style={styles.row}>
// //           <Text style={styles.header}>Categories</Text>

// //           {/* <TouchableOpacity onPress={() => router.push("../Categories/seeAll")}>
// //               <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}>➡️</Text>
// //               </Text>
// //           </TouchableOpacity> */}
// //           <TouchableOpacity onPress={() => router.push('../Categories/SeeAllCategories')}>
// //               <Text style={styles.all}>see all <Text style={{ fontSize: 20 }}></Text></Text>
// //           </TouchableOpacity>
// //        </View>

// //        <View>
// // <FlatList
// //       data={categories}
// //       horizontal
// //       keyExtractor={(item) => item.name}
// //       renderItem={({ item }) => (
// //         <TouchableOpacity
// //           style={styles.categoryItem}
// //           onPress={() => {
// //             if (item.name === "Mobiles") {
// //               router.push("../Categories/mobile");

// //             } else if (item.name === "pants") {
// //               router.push("../Categories/pants");

// //             } else if (item.name === "jackets") {
// //               router.push("../Categories/jackets");

// //             } else if (item.name === "dresses") {
// //               router.push("../Categories/dresses");

// //             } else if (item.name === "t-shirt") {
// //               router.push("../Categories/t-shirt");

// //             }else if (item.name === "wedding") {
// //               router.push("../Categories/wedding");
// //             }
// //             else if (item.name === "sweatshirt") {
// //               router.push("../Categories/sweatshirt");
// //             }
// //             // else if (item.name === "see all") {
// //             //   router.push("../Categories/sweatshirt");
// //             // }
// //           }}
// //     >
// //       <Image source={item.image} style={styles.categoryImage} />
// //       <Text style={styles.categoryText}>{item.name}</Text>
// //     </TouchableOpacity>
// //   )}
// //   showsHorizontalScrollIndicator={false}
// //   style={[styles.flatList]} 
// //   />
// // </View>







// //       <FlatList
// //         data={data}
// //         renderItem={renderItem}
// //         horizontal={true}
// //         showsHorizontalScrollIndicator={false}
// //       />
// //       <View>
// //         <Text style={styles.text}> Top selling</Text>
// //         <FlatList
// //           data={data}
// //           renderItem={renderItem}
// //           horizontal={true}
// //           showsHorizontalScrollIndicator={false}
// //         />
// //       </View>


// //     </View>
// //   )
// // }
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 2,
// //     padding: 1,
// //   },
// //   icons: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     width: "90%",
// //     margin: "auto",
// //     marginTop: '5%'
// //   },
// //   icon: {
// //     backgroundColor: "gray",
// //     width: 40,
// //     height: 40,
// //     borderRadius: 40,
// //     textAlign: 'center',
// //     padding: 8,
// //     fontSize: 20,
// //     color: 'white'
// //   },
// //   SearchBar: {
// //     flexDirection: 'row',
// //     backgroundColor: 'lightgray',
// //     width: '90%',
// //     margin: 'auto',
// //     marginTop: '5%',
// //     borderRadius: 30,
// //     padding: '1.5%',
// //   },
// //   texts: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     width: '90%',
// //     margin: 'auto',
// //     fontWeight: 'bold',
// //     marginTop: '2%',
// //   },
// //   text: {
// //     marginTop: 10,
// //     fontSize: 20,
// //     fontFamily: "cursive"
// //   },
// //   title: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: 'black',
// //   },
// //   input: {
// //     width: '90%',
// //     height: 50,
// //     borderWidth: 1,
// //     borderColor: '#000',
// //     paddingHorizontal: 10,
// //     borderRadius: 25,
// //     backgroundColor: '#ffffff',
// //   },
// //   row: {
// //     flexDirection: 'row', 
// //     justifyContent: 'space-between', 
// //     padding: 10,
// //     alignItems: 'center', 
// //   },
// //   header: {
// //     // flex: ,
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     marginBottom: 10,
// //     marginTop: 5,

// //   },
// //   all:{

// //     textAlign: "right",
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     marginBottom: 10,
// //     marginTop: 5,
// //     textDecorationLine: "underline", 

// //   },
// //   categoryItem: {
// //     alignItems: "center",
// //     marginRight: 15, 
// //   },
// //   categoryImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //   },
// //   categoryText: {
// //     textAlign: "center",
// //     marginTop: 5,
// //   },
  
// //   flatList: {
// //     height: 10, 
// //     marginVertical: 10,
// //     // backgroundColor: "red",
// //     borderRadius: 20,}  
  
// // })

// // export default Home;