import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase.jsx";
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const cartRef = collection(db, "Users", user.uid, "cart");
        const cartSnap = await getDocs(cartRef);

        const items = await Promise.all(
          cartSnap.docs.map(async (docSnap) => {
            const { productId, quantity } = docSnap.data();
            const productRef = doc(db, "products", productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
              const productData = productSnap.data();
              return {
                id: docSnap.id,
                productId,
                quantity,
                ...productData
              };
            }
            return null;
          })
        );

        setCart(items.filter(item => item !== null));
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id, type) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const item = cart.find(i => i.id === id);
    if (!item) return;

    const newQuantity = type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    const itemRef = doc(db, "Users", user.uid, "cart", id);
    await updateDoc(itemRef, { quantity: newQuantity });

    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );
  };

  const removeFromCart = async (id) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const itemRef = doc(db, "Users", user.uid, "cart", id);
    await deleteDoc(itemRef);

    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    const cartRef = collection(db, "Users", user.uid, "cart");
    const cartSnap = await getDocs(cartRef);
    const deletions = cartSnap.docs.map(docSnap => deleteDoc(doc(db, "Users", user.uid, "cart", docSnap.id)));
    await Promise.all(deletions);

    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cart.length > 0 ? 50 : 0;
  const tax = 0;
  let total = subtotal + shippingCost + tax;
  if (totalItems >= 5) total *= 0.9;
  total = Math.round(total);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/products')}>
            <Ionicons name="pricetags-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/home')}>
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

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/singlepage", params: { id: item.productId } })}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

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
