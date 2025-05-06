import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import Data from "../data";
import images from "../images";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
};

type ImageKeys = keyof typeof images;

export default function CategoryScreen() {
  const { type } = useLocalSearchParams();
  const searchName = typeof type === "string" ? type.toLowerCase() : "";
  const categoryType = typeof type === "string" ? type.toLowerCase() : "";
  const router = useRouter();
  const categoryMap: { [key: string]: string } = {
    mobile: "mobile",
  };

  const categoryCode = categoryMap[categoryType];

  const filteredProducts = Data.filter((product) => {
    const name = product.name.toLowerCase();
    const desc = product.description.toLowerCase();

    if (categoryType === "mobile") {
      const hasMobileKeyword =
        name.includes("mobile") ||
        name.includes("phone") ||
        desc.includes("mobile") ||
        desc.includes("phone");
      return hasMobileKeyword;
    }
    return name.includes(searchName) || desc.includes(searchName);
  });

  return (
    <>
      <Stack.Screen name="address" options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { router.back() }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back-circle-outline" size={36} color="#5D4037" />
        </TouchableOpacity>

        <Text style={styles.header}>{searchName}</Text>

        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <Image
                  source={images[item.image as ImageKeys]}
                  style={styles.image}
                />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price} EGP</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noData}>
            No products found matching "{searchName}".
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },

  header: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 18,
  },
  productItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    color: "#555",
  },
  noData: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  back: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
});
