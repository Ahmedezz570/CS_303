import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../../Firebase/Firebase';
import { MaterialIcons, FontAwesome, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Product {
  id: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  quantity?: number;
}

const orders = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const itemAnim = useRef(new Animated.Value(0)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "Users", userId));

      if (!userDoc.exists()) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userOrders = userData.UserOrder || [];

      if (!userOrders.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productMap = new Map<string, number>();
      userOrders.forEach((productId: string) => {
        productMap.set(productId, (productMap.get(productId) || 0) + 1);
      });

      const productPromises = Array.from(productMap.keys()).map(async (productId) => {
        try {
          const productDoc = await getDoc(doc(db, "products", productId));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const quantity = productMap.get(productId) || 0;
            const price = productData.price || 0;

            return {
              id: productDoc.id,
              name: productData.name,
              price: price,
              image: productData.image,
              description: productData.description,
              quantity: quantity
            };
          }
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
        return null;
      });

      const fetchedProducts = (await Promise.all(productPromises))
        .filter(Boolean) as Product[];

      const total = fetchedProducts.reduce(
        (acc, product) => acc + ((product.price || 0) * (product.quantity || 1)),
        0
      );

      setProducts(fetchedProducts);
      setTotalSpent(total);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserOrders();
  };

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const navigateToProductDetail = (productId: string) => {
    router.push({
      pathname: '/singlepage',
      params: { id: productId }
    });
  };

  const runItemAnimation = () => {
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (products.length > 0) {
      runItemAnimation();
    }
  }, [products]);

  const renderProductItem = ({ item, index }: { item: Product, index: number }) => {
    const itemOpacity = itemAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const itemTranslateY = itemAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ opacity: itemOpacity, transform: [{ translateY: itemTranslateY }] }}>
        <TouchableOpacity
          style={styles.productCard}
          activeOpacity={0.8}
          onPress={() => navigateToProductDetail(item.id)}
        >
          <View style={styles.productContent}>
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.productImage, styles.noProductImage]}>
                  <MaterialIcons name="image-not-supported" size={30} color="#a0a0a0" />
                </View>
              )}
              <View style={styles.orderStatusContainer}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.orderStatusText}>Delivered</Text>
              </View>
            </View>

            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description || 'No description available'}
              </Text>

              <View style={styles.infoRow}>
                <View style={styles.infoChip}>
                  <FontAwesome name="dollar" size={14} color="#388E3C" />
                  <Text style={styles.infoText}>${item.price?.toFixed(2)}</Text>
                </View>
                <View style={styles.infoChip}>
                  <AntDesign name="tagso" size={14} color="#D32F2F" />
                  <Text style={styles.infoText}>
                    {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </View>

              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Subtotal:</Text>
                <Text style={styles.subtotalValue}>
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>

              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Feather name="chevron-right" size={18} color="#555" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <LinearGradient
        colors={['#FFF0E1', '#FFE4C4']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { router.back() }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>

        {!loading && products.length > 0 && (
          <View style={styles.orderSummary}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <MaterialIcons name="shopping-bag" size={24} color="#6D4C41" />
                <Text style={styles.summaryText}>
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </Text>
              </View>
              <View style={styles.summarySeparator} />
              <View style={styles.summaryItem}>
                <FontAwesome name="dollar" size={20} color="#388E3C" />
                <Text style={styles.summaryText}>
                  Total: ${totalSpent.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8D6E63" />
            <Text style={styles.loadingText}>Fetching your orders...</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#A1887F" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyText}>Looks like you haven't placed any orders.</Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => {
                  animatePress();
                  router.push('../(tabs)');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
                <AntDesign name="arrowright" size={20} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8D6E63']}
                tintColor="#8D6E63"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4E342E',
    textAlign: 'center',
  },
  orderSummary: {
    marginHorizontal: 15,
    marginBottom: 20,
    marginTop: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 15,
    color: '#5D4037',
    fontWeight: '500',
  },
  summarySeparator: {
    width: 1,
    height: '60%',
    backgroundColor: '#D7CCC8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    color: '#6D4C41',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  emptyIcon: {
    marginBottom: 15,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#795548',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: '#795548',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 30,
  },
  productCard: {
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#9E9E9E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  productContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  noProductImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  orderStatusContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#388E3C',
    marginLeft: 4,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  subtotalLabel: {
    fontSize: 13,
    color: '#757575',
    marginRight: 6,
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#616161',
    marginRight: 2,
    fontWeight: '500',
  },
});

export default orders;