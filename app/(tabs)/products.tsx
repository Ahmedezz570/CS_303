import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import {React,useState} from 'react';
import daata from '../data.js'
import images from '.././images.js';

const products = () => {
    const [data,setdata]=useState(daata)
  return (
    <View style={styles.container}>
              <View  style={{
                backgroundColor: '#fffff',
                padding: '3%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
            }}>
        <Text style={{
            fontSize: 15,
            fontWeight: 'bold',
            marginBottom: '2%',
            color: 'black',
    
        }} > All Products </Text>
        <TextInput 
          placeholder=" search" style={{color: 'black',
            height: 50,
            width: '90%',

            borderWidth: 1,
            borderColor: '#000',
            marginBottom: '5%',
            paddingHorizontal: 10,
            borderRadius: 100,
            backgroundColor: '#ffffff',
            shadowColor: '#000',

          }}
          onChangeText={(text) => setdata(daata.filter(item => item.name.toLowerCase().includes(text.toLowerCase())))}
        />
    
      </View>
      <FlatList
      numColumns={2}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
                 source= {images[item.image] || require("../../assets/images/R.jpeg")} 
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
  card: {
    backgroundColor: '#f9f9f9',
    padding: 0,
    borderRadius: 18,
    marginBottom: '0.5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '50%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '75%',
    height: '60%',
    margin:'5%',
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

export default products;
  