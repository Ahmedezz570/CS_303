import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TextInput, ScrollView, TouchableOpacity, Pressable, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 24;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../../Firebase/Firebase';
import { collection, onSnapshot , arrayUnion} from "firebase/firestore";
import { MaterialIcons } from '@expo/vector-icons';
import {auth} from "../../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const currentUser = auth.currentUser;
  console.log(currentUser);
  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      await AsyncStorage.removeItem('DataForUser');
      router.replace("/Login"); 
      Alert.alert("Logout successful");
    } catch (error) {
      Alert.alert("Error", "There was an issue logging out. Please try again.");
      console.error(error);  
    }
  };
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        docId: doc.id,  ...doc.data(),
      }));
      setProducts(usersData);
    });

    return () => unsubscribe();
  }, []);

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const applyDiscount = (price , discountPercentage ) => {
    return Math.floor(price - (price * discountPercentage) / 100);
  };

  
  
  const handleAddToCart = async (item) => {
    console.log("Adding to cart:", item.docId);
    console.log("Adding to cart:", item.price);
  
    if (!currentUser) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
  
    try {
      const cartDocRef = doc(db, 'Users', currentUser.uid, 'cart', item.docId);
      const cartDocSnap = await getDoc(cartDocRef);
  
      if (cartDocSnap.exists()) {
        
        await updateDoc(cartDocRef, {
          quantity: increment(1),
         
        });
      } else {
       
        await setDoc(cartDocRef, {
          productId: item.docId,
          quantity: 1,
          createdAt: new Date(),
        });
      }
  
      Alert.alert("Success", "Product added to cart!");
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };
  
  const handleFavorite = async (item) => {
    try {
        const userDocRef = doc(db, "Users", auth.currentUser.uid);

        
            await updateDoc(userDocRef, {
                Fav: arrayUnion(item.docId),
            });
            
            Alert.alert("Favorite", `${item?.name} has been added to favorites!`);
        
    } catch (error) {
        console.error("Error updating favorites:", error);
        Alert.alert("Error", "Could not update favorites. Please try again.");
    }
};
  const Item = ({ item }) => {
    const router = useRouter();
  
    
    return (
      <TouchableOpacity onPress={() => router.push({ pathname: "/singlepage", params: { id: item.docId } })}>
  <View style={styles.card}>
  
    <View style={{ position: 'relative', width: '100%', height: 120 }}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.discountContainer}>
              <Icon name="tag" size={14} color="#fff" />
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: 6,
          borderRadius: 20,
        }}
        onPress={() => {
          handleFavorite(item);
        }}
      >
        <Icon name="heart" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    <Text style={styles.title} numberOfLines={3}>{item.name}</Text>

    <View style={styles.priceContainer}>
      <Text style={styles.oldPrice}>{formatNumber(item.price)} EGP</Text>
      <Text style={styles.newPrice}>{formatNumber(applyDiscount(item.price , item.discount))} EGP</Text>
    </View>

    
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10, 
        width:"100%"
      }}
      onPress={() => {
        handleAddToCart(item)
      }}
    >
      <Icon name="shopping-cart" size={20} color="#fff" />
      <Text style={{ color: '#fff', marginLeft: 5 }}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
</TouchableOpacity>

    );
    
  };
  
  const Categories = [
    { id : 1,name: "Mobile", image: "https://i.ibb.co/4ZhGCKn2/apple-iphone-16-pro-desert-1-3.jpg" },
    { id : 2,name: "Computers", image:"https://i.ibb.co/xqvrtNZD/zh449-1.jpg" },
    { id : 3,name: "TVs", image: "https://i.ibb.co/vvTrVWFD/tv556-1.jpg" },
    { id : 4,name: "Men", image: "https://i.ibb.co/RGzqBrwk/1.jpg" },
    {id : 5, name: "Women", image: "https://i.ibb.co/Kzr7MVxM/1.jpg" },
    { id : 6,name: "Kids", image: "https://i.ibb.co/20TYN7Lz/1.jpg" },
  ];
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
  
        if (data !== null) {
          const parsedData = JSON.parse(data);
          console.log('Parsed userData:', parsedData);
        } else {
          console.log('No userData found in storage.');
        }
      } catch (error) {
        console.log('Error reading userData from storage:', error);
      }
    };
  
    checkStorage();
  }, []); 
  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };
  return (
      <>
    <Stack  screenOptions={{ headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
    <TouchableOpacity onPress={() => handleLogout()}>
      <View style={styles.headerIconContainer}>
      <MaterialIcons name="logout" size={24} color="white" />
      {/* <Text style={[styles.settingText, { color: 'red' }]}>Logout</Text> */}
      </View>
    </TouchableOpacity>
  <TouchableOpacity onPress={() => router.push("/cart")}>
    <View style={styles.headerIconContainer}>
      <Icon name="shopping-cart" size={20} color="#fff" />
    </View>
  </TouchableOpacity>
</View>



     
      <TouchableOpacity onPress={() => router.push("/Search")}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#888" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Search..." 
            placeholderTextColor="#aaa" 
            editable={false} 
          />
        </View>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={Categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
           <TouchableOpacity onPress={() => {
           router.push({
             pathname: "/DisplayCategories",
             params: { title: item.name }
           });
           }}>
          <View style={styles.categoryItem}>
           
  <Image source={{uri : item.image}} style={styles.categoryImage} />

   {selectedCategory && <DispalyCategories title = {selectedCategory}/>}
            <Text style={styles.categoryText}>{item.name}</Text>
          </View></TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

  <View style={styles.imageContainer}>
    <Image source={{ uri: 'https://b.top4top.io/p_34113iqov1.png' }} style={styles.bannerimage} />
  </View>

      <Text style={styles.sectionTitle}>Top Selling</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.docId.toString()}
        renderItem={({ item }) => <Item item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

     
      <Text style={styles.sectionTitle}>New in</Text>
      <FlatList
        data={products.slice(-5)}
        keyExtractor={(item) => item.docId.toString()}
        renderItem={({ item }) => (
          <Item item={item} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newIn}
      />

      <Text style={styles.sectionTitle}>ٌRecommend For You </Text>
      <FlatList
        data={[...products].sort(() => Math.random() - 0.5).slice(0, 4)}
        keyExtractor={(item) => item.docId.toString()}
        renderItem={({ item }) => (
  
          <Item  item={item} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newIn}
      />
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  featuredProductButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  featuredButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
     marginRight: 10 
    },
  input: {
     flex: 1, 
     fontSize: 16, 
     color: "#333" 
    },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "cursive"
  },
  listContainer: { 
    paddingBottom: 20 
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    height: 330, 
    justifyContent: 'space-between', 
  },
  
  image: {
    width: '100%', 
    height: 120,
    resizeMode: 'contain', 
    borderRadius: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10, 
    textAlign: 'center',
    color: '#333',
  },

  price: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8, 
    textAlign: 'center', 
  },
  newIn: {
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIconContainer: {
    backgroundColor: "#000",
    width: 45,
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  bannerimage: {
    width: '100%',
    height: 120, 
    resizeMode: 'contain', 
    borderRadius: 10,
  },
  imageContainer: {
    width: 370,
    // height: 200, 
  
  },
  discountContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#E91E63",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    fontSize: 15,
    fontWeight : 'bold'
  },
  newPrice: {
    color: "#E91E63",
    fontWeight: "bold",
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default HomePage;
