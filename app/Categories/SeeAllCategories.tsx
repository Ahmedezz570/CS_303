import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Stack,useRouter } from 'expo-router';

const categories = [
  { name: 'mobile', image: require('../../assets/images/1311208664.png') },
  { name: 'pants', image: require('../../assets/images/ba1.png') },
  { name: 'dresses', image: require('../../assets/images/dress2.png') },
  { name: 'jackets', image: require('../../assets/images/jacet1.png') },
  { name: 't-shirt', image: require('../../assets/images/te1.png') },
  { name: 'sweatshirt', image: require('../../assets/images/sw1.png') },
  { name: 'wedding', image: require('../../assets/images/we1.png') },
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
            onPress={() => {
              router.push('../(tabs)/home');
            }}
          >
            <Image
              source={require("../../assets/images/backbutton.png")}
              style={styles.back}
            />
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
    position: "absolute",
    top: 25,
    left: 20,
    width: 40,
    height: 40,
    zIndex: 999, 
    elevation: 10,
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
