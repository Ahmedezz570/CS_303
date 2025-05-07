import React, { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { db } from '../Firebase/Firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
const applyDiscount = (price, discountPercentage) => {
  return Math.floor(price - (price * discountPercentage) / 100);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const DisplayCategories = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const categoryName = typeof title === "string" ? title : "";
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      
      const categoryNameLower = categoryName.toLowerCase();
      console.log("Filtering by category:", categoryNameLower);
      
      let categoryType;
      switch(categoryNameLower) {
        case 'mobile':
          categoryType = 1;
          break;
        case 'pants':
          categoryType = 2;
          break;
        case 'dress':
          categoryType = 3;
          break;
        case 'jacket':
          categoryType = 4;
          break;
        case 'sweatshirt':
          categoryType = 5;
          break;
        case 't-shirt':
          categoryType = 6;
          break;
        case 'wedding':
          categoryType = 7;
          break;
        default:
          categoryType = null;
      }
      
      console.log("Category type:", categoryType);
      
      const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
        console.log("Total products fetched:", snapshot.docs.length);
        
        // تخزين جميع المنتجات
        const allProducts = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        
        // تصفية المنتجات بطريقة مرنة
        const filteredProducts = allProducts.filter(product => {
          // طريقة 1: حسب category/type
          if (categoryType && product.type === categoryType) return true;
          
          // طريقة 2: فحص حقل الاسم
          if (product.name && product.name.toLowerCase().includes(categoryNameLower)) return true;
          
          // طريقة 3: فحص حقل الوصف
          if (product.description && product.description.toLowerCase().includes(categoryNameLower)) return true;
          
          // طريقة 4: تصفية حسب حقل الفئة إذا كان نصياً
          if (typeof product.category === 'string' && 
              product.category.toLowerCase().includes(categoryNameLower)) return true;
          
          return false;
        });
        
        console.log("Filtered products:", filteredProducts.length);
        
        setProducts(filteredProducts);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error in category products effect:", error);
      setIsLoading(false);
    }
  }, [categoryName]);

  // Product item component
  const ProductItem = ({ item }) => {
    const randomDiscount = useMemo(() => Math.floor(Math.random() * 41) + 10, [item.docId]);
    
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push({ pathname: "/singlepage", params: { id: item.docId } })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>{item.price} EGP</Text>
            <Text style={styles.newPrice}>{formatNumber(applyDiscount(item.price, item.discount))} EGP</Text>
          </View>
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: categoryName,
          headerStyle: { backgroundColor: '#f9f9f9' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </Text>
        </View>

        {products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.docId}
            renderItem={({ item }) => <ProductItem item={item} />}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  countContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  countText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '47%',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 13,
  },
  newPrice: {
    color: '#E91E63',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discountTag: {
    position: 'absolute',
    top: -150,
    right: 0,
    backgroundColor: '#E91E63',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default DisplayCategories;