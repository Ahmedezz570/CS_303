import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db, getUserData } from "../Firebase/Firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove ,setDoc} from 'firebase/firestore';
import Review from './Review'
import { getAuth } from 'firebase/auth';
import { Stack,useRouter } from 'expo-router';




const ProductDetails = () => {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();


    const userId = auth.currentUser.uid;

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
    };

    const parseDescription = (desc) => {
        if (!desc) return [];

        return desc.split('\n').map(line => {
            const [label, data] = line.split(': ');
            return { label, data };
        }).filter(item => item.label && item.data);
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product: ", error);
            }
        };

        const checkFavoriteStatus = async () => {
            try {
                const userDocRef = doc(db, "Users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const favoritesList = userData.Fav || [];
                    setIsFavorite(favoritesList.includes(id));
                }
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        getProduct();
        checkFavoriteStatus();
    }, [id, userId]);

    const handleFavorite = async () => {
        try {
            const userDocRef = doc(db, "Users", userId);

            if (isFavorite) {
                await updateDoc(userDocRef, {
                    Fav: arrayRemove(id)
                });
                setIsFavorite(false);
                Alert.alert("Removed", `${product?.name} has been removed from favorites!`);
            } else {
                await updateDoc(userDocRef, {
                    Fav: arrayUnion(id)
                });
                setIsFavorite(true);
                Alert.alert("Favorite", `${product?.name} has been added to favorites!`);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            Alert.alert("Error", "Could not update favorites. Please try again.");
        }
    };
    const handleAddToCart = async () => {
        const currentUser = getAuth().currentUser;
    
        if (!id) {
            Alert.alert("Error", "Product ID is missing.");
            return;
        }
    
        const userDocRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
    
        if (!docSnap.exists()) {
            const cartItem = {
                productId: id,
                quantity: 1,
            };
            await setDoc(userDocRef, {
                cart: [cartItem],
            });
        } else {
            const userData = docSnap.data();
            const cart = Array.isArray(userData.cart) ? userData.cart : [];
            const existingItemIndex = cart.findIndex(item => item.productId === id);
    
            if (existingItemIndex === -1) {
                const cartItem = {
                    productId: id,
                    quantity: 1,
                };
                await updateDoc(userDocRef, {
                    cart: arrayUnion(cartItem),
                });
            } else {
                const updatedCart = [...cart];
                const existingItem = updatedCart[existingItemIndex];
                const newItem = { ...existingItem, quantity: existingItem.quantity + 1 };
    
                updatedCart.splice(existingItemIndex, 1); 
                updatedCart.push(newItem);
    
                await updateDoc(userDocRef, {
                    cart: updatedCart,
                });
            }
        }
    
        router.push('/cart');
    };
    
    const descriptionItems = parseDescription(product?.description);

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerWrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite} style={styles.heartButton}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF6B6B" : "#333"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageWrapper}>
                    <Image
                        source={
                            typeof product.image === 'string'
                                ? { uri: product.image }
                                : require("../assets/images/loading-buffering.gif")
                        }
                        style={styles.image}
                    />
                </View>

                <View style={styles.productHeader}>
                    <Text style={styles.name}>{product?.name}</Text>
                    <Text style={styles.price1}>{formatPrice(product?.price)} EGP</Text>

                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= 4 ? "star" : "star-outline"}
                                size={16}
                                color="#FFD700"
                                style={{ marginRight: 2 }}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.sectionTitle}>Details</Text>

                    {descriptionItems.length > 0 ? (
                        descriptionItems.map((item, index) => (
                            <View key={index} style={[
                                styles.descriptionItem,
                                index === descriptionItems.length - 1 && { borderBottomWidth: 0 }
                            ]}>
                                <View style={styles.labelContainer}>
                                    <Ionicons name="information-circle-outline" size={16} color="#666" style={{ marginRight: 5 }} />
                                    <Text style={styles.descriptionLabel}>{item.label}</Text>
                                </View>
                                <Text style={styles.descriptionData}>{item.data}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.description}>{product?.description}</Text>
                    )}
                </View>
                <Review productId={id} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToCart} activeOpacity={0.8}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total Price</Text>
                        <Text style={styles.price}>{formatPrice(product?.price)} EGP</Text>
                    </View>
                    <View style={styles.addCartContainer}>
                        <Ionicons name="cart-outline" size={20} color="#333" style={{ marginRight: 8 }} />
                        <Text style={styles.text}>Add to cart</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerWrapper: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
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
        paddingVertical: 12,
    },
    backButton: {
        backgroundColor: '#FAE5D3',
        padding: 10,
        borderRadius: 50,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    heartButton: {
        backgroundColor: '#FAE5D3',
        padding: 10,
        borderRadius: 50,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageWrapper: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    image: {
        width: '90%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
        borderRadius: 50,
        marginVertical: 15,
    },
    productHeader: {
        marginVertical: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    price1: {
        fontSize: 22,
        color: '#2E7D32',
        fontWeight: 'bold',
        marginTop: 5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    ratingText: {
        marginLeft: 4,
        color: '#777',
        fontSize: 14,
    },
    descriptionContainer: {
        marginTop: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        letterSpacing: 0.3,
    },
    descriptionItem: {
        flexDirection: 'column',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    descriptionLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#666',
    },
    descriptionData: {
        fontSize: 15,
        color: '#333',
        marginLeft: 21,
        lineHeight: 22,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
        color: '#4A3222',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5e1d7',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 2,
    },
    price: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    addCartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ProductDetails;
