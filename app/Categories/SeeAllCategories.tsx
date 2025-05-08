import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Category {
  id?: string;
  name: string;
  image: { uri: string };
}

const fallbackCategories: Category[] = [
  { name: 'mobile', image: { uri: "https://i.ibb.co/4ZhGCKn2/apple-iphone-16-pro-desert-1-3.jpg" } },
  { name: 'pants', image:{ uri: "https://i.ibb.co/xqvrtNZD/zh449-1.jpg" } },
  { name: 'dresses', image:{ uri: "https://i.ibb.co/vvTrVWFD/tv556-1.jpg" } },
  { name: 'jackets', image:{ uri: "https://i.ibb.co/RGzqBrwk/1.jpg" } },
  { name: 't-shirt', image: { uri: "https://i.ibb.co/Kzr7MVxM/1.jpg" } },
  { name: 'sweatshirt', image:{ uri: "https://i.ibb.co/4ZhGCKn2/apple-iphone-16-pro-desert-1-3.jpg" } },
  { name: 'wedding', image: { uri: "https://i.ibb.co/4ZhGCKn2/apple-iphone-16-pro-desert-1-3.jpg" } },
];

export default function SeeAllCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        
        if (!categoriesSnapshot.empty) {
          const categoriesData: Category[] = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Unknown",
            image: { uri: doc.data().imageUrl || "https://via.placeholder.com/150" }
          }));
          setCategories(categoriesData);
        } else {
          const productsSnapshot = await getDocs(collection(db, "products"));
          const uniqueCategories = new Map<string, Category>();
          
          productsSnapshot.docs.forEach((doc) => {
            const product = doc.data();
            if (product.category && !uniqueCategories.has(product.category.toLowerCase())) {
              uniqueCategories.set(product.category.toLowerCase(), {
                id: uniqueCategories.size.toString(),
                name: product.category.toLowerCase(),
                image: { uri: product.image || "https://via.placeholder.com/150" }
              });
            }
          });
          
          const extractedCategories: Category[] = Array.from(uniqueCategories.values());
          setCategories(extractedCategories.length > 0 ? extractedCategories : fallbackCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
        setCategories(fallbackCategories); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen name="address" options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>All Categories</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { router.back() }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
        </TouchableOpacity>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setIsLoading(true);
                (async () => {
                  try {
                    setIsLoading(true);
                    
                    const categoriesSnapshot = await getDocs(collection(db, "categories"));
                    
                    if (!categoriesSnapshot.empty) {
                      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().name || "Unknown",
                        image: { uri: doc.data().imageUrl || "https://via.placeholder.com/150" }
                      }));
                      setCategories(categoriesData);
                    } else {
                      const productsSnapshot = await getDocs(collection(db, "products"));
                      const uniqueCategories = new Map<string, Category>();
                      
                      productsSnapshot.docs.forEach((doc) => {
                        const product = doc.data();
                        if (product.category && !uniqueCategories.has(product.category.toLowerCase())) {
                          uniqueCategories.set(product.category.toLowerCase(), {
                            id: uniqueCategories.size.toString(),
                            name: product.category.toLowerCase(),
                            image: { uri: product.image || "https://via.placeholder.com/150" }
                          });
                        }
                      });
                      
                      const extractedCategories = Array.from(uniqueCategories.values());
                      setCategories(extractedCategories.length > 0 ? extractedCategories : fallbackCategories);
                    }
                  } catch (error) {
                    console.error("Error fetching categories:", error);
                    setError("Failed to load categories");
                    setCategories(fallbackCategories);
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length > 0 ? (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id || item.name}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => router.push(`../Categories/${item.name.replace(/\s/g, '')}`)}
              >
                <Image 
                  source={item.image} 
                  style={styles.categoryImage} 
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 17.5,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    marginTop: 40,
  },
  categoryItem: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textTransform: 'capitalize',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});
