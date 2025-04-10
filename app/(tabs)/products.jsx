import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import daata from '../data.js';
import images from '../images.js';

const Products = () => {
  const [data, setData] = useState(daata);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>All Products</Text>
        <TextInput 
          placeholder="Search" 
          style={styles.searchInput}
          onChangeText={(text) => 
            setData(daata.filter(item => item.name.toLowerCase().includes(text.toLowerCase())))
          }
        />
      </View>
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/singlepage", params: { id: item.id } })}
            >
            <Image 
              source={images[item.image] || require("../../assets/images/R.jpeg")} 
              style={styles.image} 
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} EGP</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FAE5D3',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: 'black',
  },
  searchInput: {
    color: 'black',
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: '5%',
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    margin: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '48%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '75%',
    height: '60%',
    margin: '5%',
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: '2%',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'black',
  },
});

export default Products;
