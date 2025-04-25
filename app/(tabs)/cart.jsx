import { View, Text,FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import images from '../images.js';
import { useCart } from '../item/CartContext.js';

const CartScreen = () => {
  const router = useRouter();
  const { cart, updateQuantity , removeFromCart } = useCart();

  console.log('Cart:', cart);
  console.log('SetCart:', typeof setCart);

  const handleQuantityChange = (id, type) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQuantity = type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateQuantity(id, newQuantity);
  };
  
  const changeQuantity = (id, type) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQuantity = type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateQuantity(id, newQuantity);
  };
  

  const removeItem2 = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  const removeItem = (id) => {
    removeFromCart(id);
  };
  

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 50;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  cartList: { flex: 1 },
  cartItem: {
    flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10,
    borderRadius: 10, marginBottom: 10, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
    flexWrap: 'wrap'
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
    backgroundColor: '#E5C7A9', padding: 15, borderRadius: 10,
    marginTop: 10, alignItems: 'center'
  },
  checkoutText: { fontSize: 18, fontWeight: 'bold', color: '#fff' }
});

export default CartScreen;
