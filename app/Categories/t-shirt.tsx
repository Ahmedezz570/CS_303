
import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import daata from '../data.js';
import images from '../images.js';

const tShirts = () => {
  const [data, setData] = useState<Array<typeof daata[0]>>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const filteredData = daata.filter((item) => item.name === "t-shirt");
    setData(filteredData);
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = daata.filter(
      (item) => item.name === "t-shirt" && item.name.toLowerCase().includes(text.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.title}>t-shirts</Text>
        <TextInput
          placeholder="🔍 Search Products..."
          style={styles.input}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => <Text style={styles.empty}>No products found 😢</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={images[item.image as keyof typeof images] || require("../../assets/images/R.jpeg")}
              style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} EGP</Text>
          </View>
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
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
    width: '48%',
    marginHorizontal: '1%',
    aspectRatio: 1,
  },
  image: {
    width: '75%',
    height: '60%',
    margin: '5%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'black',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default tShirts;