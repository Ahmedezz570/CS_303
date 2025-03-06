import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import data from './data.js';
import images from './images.js';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const ProductDetails = () => {
    const { id } = useLocalSearchParams(); 
    const navigation = useNavigation();
    const product = data.find(item => item.id === parseInt(Array.isArray(id) ? id[0] : id));

    const handleFavorite = () => {
        Alert.alert("Favorite", `${product?.name} has been added to favorites!`);
    };

    const handleAddToCart = () => {
        Alert.alert("Cart", `${product?.name} has been added to cart!`);
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite} style={styles.heartButton}>
                        <Ionicons name="heart" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <Image 
                    source={ images[product?.image] || require("../assets/images/R.jpeg")} 
                    style={styles.image} 
                />
                <Text style={styles.name}>{product?.name}</Text>
                <Text style={styles.description}>{product?.description}</Text>
                <Text style={styles.price1}>{product?.price} EGP</Text>
                <Text style={styles.description}>This is a great product that you will love!</Text>  
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                    <Text style={styles.price}>EGP {product?.price}</Text>
                    <Text style={styles.text}>Add to cart</Text>
                </TouchableOpacity>  
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        paddingBottom: 100,  
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backButton: {
        backgroundColor: '#FAE5D3',
        padding: 10,
        borderRadius: 50,
    },
    heartButton: {
        backgroundColor: '#FAE5D3',
        padding: 10,
        borderRadius: 50,
    },
    image: {
        width: '90%', 
        height: undefined, 
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
        borderRadius: 50, 
        marginVertical: 20, 
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    price1: {
        fontSize: 20,
        color: 'black',
        marginVertical: '1%',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 29,
        color: '#4A3222',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5e1d7',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: '90%',
    },
    price: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ProductDetails;
