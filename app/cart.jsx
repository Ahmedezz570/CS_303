import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import images from './images.js';
import { useCart } from './item/CartContext.js';
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase/Firebase.jsx";
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (id, type) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQuantity = type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateQuantity(id, newQuantity);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cart.length > 0 ? 50 : 0;
  const tax = 0;

  let total = subtotal + shippingCost + tax;
  if (totalItems >= 5) {
    total *= 0.9;
  }
  total = Math.round(total);

  const handleCheckout = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You need to be logged in to checkout.");
        return;
      }

      const order = {
        userId: user.uid,
        email: user.email,
        items: cart,
        subtotal,
        shippingCost,
        tax,
        total,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, "orders"), order);
      clearCart();
      Alert.alert("Success", "Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Error", "There was a problem placing your order.");
    }
  };

  return (
    <View style={styles.container}>
  <View style={styles.topBar}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
      <Ionicons name="arrow-back-outline" size={24} color="black" />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => router.push('/(tabs)/products')}
    >
      <Ionicons name="pricetags-outline" size={24} color="black" />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => router.push('/(tabs)/home')}
    >
      <Ionicons name="home-outline" size={24} color="black" />
    </TouchableOpacity>
  </View>

  <Text style={styles.title}>Cart</Text>

  {cart.length > 0 ? (
    <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
      <Text style={styles.clearButtonText}>Remove All</Text>
    </TouchableOpacity>
  ) : (
    <View style={{ width: 90 }} />
  )}
</View>





      <View style={styles.cartList}>
        {cart.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/singlepage", params: { id: item.id } })}>
              <Image source={images[item.image]} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>Size - {item.size}  Color - {item.color}</Text>
              <Text style={styles.price}>EGP{item.price * item.quantity}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'decrease')} style={styles.quantityButton}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'increase')} style={styles.quantityButton}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Subtotal: EGP{subtotal}</Text>
        <Text style={styles.summaryText}>Shipping Cost: EGP{shippingCost}</Text>
        <Text style={styles.summaryText}>Tax: EGP{tax}</Text>
        {totalItems >= 5 && (
          <Text style={[styles.summaryText, { color: 'green' }]}>Discount: 10% Applied</Text>
        )}
        <Text style={styles.total}>Total: EGP{total}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  
  iconButton: {
    backgroundColor: '#FAE5D3',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  
  homeButton: {
    backgroundColor: '#E5C7A9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  productsButton: {
    backgroundColor: '#E5C7A9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  
  homeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  clearButton: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartList: { flex: 1 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    flexWrap: 'wrap',
  },
  image: { width: 60, height: 60, resizeMode: 'contain', marginRight: 10 },
  info: { flex: 1, minWidth: '40%' },
  name: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 14, color: 'gray' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  quantityButton: { backgroundColor: '#ddd', padding: 5, borderRadius: 5 },
  quantityText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
  deleteButton: { backgroundColor: 'red', padding: 6, borderRadius: 5, marginLeft: 5 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  summary: { padding: 15, borderTopWidth: 1, borderColor: '#ddd', marginTop: 10 },
  summaryText: { fontSize: 16, marginBottom: 5 },
  total: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  checkoutButton: {
    backgroundColor: '#E5C7A9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  checkoutText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default CartScreen;