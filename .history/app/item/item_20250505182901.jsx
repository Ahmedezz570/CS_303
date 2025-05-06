import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useCart } from './CartContext'; 
import images from '../images';  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

const Item = ({ item }) => {
    const [pressed, setPressed] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const { addToCart } = useCart(); 

    const handleAddToCart = () => {
        addToCart(item);  
        setModalVisible(false);
        alert("Added to cart");
    };

    return (
        <View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Do you want to add to your cart?</Text>
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={handleAddToCart}>
                            <Text style={styles.textStyle}>Add to cart</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Pressable
                style={styles.item}
                onPress={() => router.push('/singlepage')}
                onLongPress={() => setModalVisible(true)}
            >
                <Image
                
                    source={images[item.image] || { uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                />
                <Text> {item.name}</Text>
                <Text> {item.price} EGY</Text>

                <TouchableOpacity onPress={() => setPressed(!pressed)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <FontAwesome
                        style={[{ color: pressed ? 'red' : 'black' }, styles.heart]}
                        name={pressed ? 'heart' : 'heart-o'}
                        size={20}
                    />
                </TouchableOpacity>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        marginHorizontal: 5,
        marginTop: 15,
        margin: 15,
        backgroundColor: 'white',
        width: width * 0.4,
        paddingTop: 15,
        paddingBottom: 20,
        borderRadius: 20,
        alignItems: 'center',
        position: 'relative'
    },
    heart: {
        fontSize: 15,
        backgroundColor: 'lightgray',
        borderRadius: 50,
        padding: '4%',
        position: 'absolute',
        bottom: 120,
        right: 208,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5
    },
    buttonClose: {
        backgroundColor: 'red'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default Item;
