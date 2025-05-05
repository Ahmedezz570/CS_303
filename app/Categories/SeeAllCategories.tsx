import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const categories = [
  { name: 'mobile', image: { uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
  { name: 'pants', image:{ uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
  { name: 'dresses', image:{ uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
  { name: 'jackets', image:{ uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
  { name: 't-shirt', image: { uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
  { name: 'sweatshirt', image:{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }},
  { name: 'wedding', image: { uri: "https://randomuser.me/api/portraits/men/1.jpg" } },
];

export default function SeeAllCategories() {
  const router = useRouter();

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
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => router.push(`../Categories/${item.name.replace(/\s/g, '')}`)}
            >
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
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
  },
  categoryItem: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    elevation: 3,
  },
  categoryImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});
