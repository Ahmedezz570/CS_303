import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity , TextInput} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24;
import {db} from '../../Firebase/Firebase';
import { collection, onSnapshot } from "firebase/firestore";


const ProductList = () => {
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const applyDiscount = (price , discountPercentage ) => {
    return Math.floor(price - (price * discountPercentage) / 100);
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
    useEffect(() => {

      const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          docId: doc.id,  ...doc.data(),
        }));
        setProducts(usersData);
      });
  
      return () => unsubscribe();
    }, []);
    console.log("Data:", products);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Products</Text>
      <TextInput
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "/singlepage", params: { id: item.docId } })}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={3}>{item.name}</Text>
                <Text style={styles.price}>EGP {applyDiscount(item.price,item.discount)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: 'center',
    height: 250,
  },
  image: {
    width: '100%',
    height: 120, 
    resizeMode: 'contain',
    borderRadius: 10,
  },
  
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  price: {
    fontSize: 14,
    color: 'red',
    fontWeight: '600',
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ProductList;