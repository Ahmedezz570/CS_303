import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../images.js';
import data from '../data.js';
import { useRouter } from 'expo-router';

const CartScreen = () => {
  const router = useRouter();
  const [cart, setCart] = useState([
    { id: 34, name: "Men's Harrington Jacket", price: 700, quantity: 1, image: 'jacet1.png', size: 'M', color: 'Lemon' },
    { id: 35, name: "Men's Coaches Jacket", price: 800, quantity: 1, image: 'jacet2.png', size: 'M', color: 'Black' }
  ]);

  const updateQuantity = (id, type) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: type === 'increase' ? item.quantity + 1 : Math.max(0, item.quantity - 1) } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 50;
  const tax = 0;
  const total = subtotal + shippingCost + tax;



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "/singlepage", params: { id: item.id } })}>
            <View style={styles.cartItem}>
              <Image source={images[item.image]} style={styles.image} />  
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>Size - {item.size}  Color - {item.color}</Text>
                <Text style={styles.price}>EGP{item.price * item.quantity}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.quantityButton}>
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.quantityButton}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  cartItem: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  image: { width: 60, height: 60, resizeMode: 'contain', marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 14, color: 'gray' },
  price: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { backgroundColor: '#ddd', padding: 5, borderRadius: 5, marginHorizontal: 5 },
  quantityText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { fontSize: 16, fontWeight: 'bold' },
  summary: { padding: 15, borderTopWidth: 1, borderColor: '#ddd', marginTop: 10 },
  summaryText: { fontSize: 16, marginBottom: 5 },
  total: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  checkoutButton: { backgroundColor: '#E5C7A9', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  checkoutText: { fontSize: 18, fontWeight: 'bold', color: '#fff' }
});

export default CartScreen;

