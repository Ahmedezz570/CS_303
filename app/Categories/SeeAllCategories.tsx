import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

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
    <View style={styles.container}>
      <Text style={styles.title}>All Categories</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FAE5D3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    margin: 10,
    borderRadius: 20,
    padding: 15,
    flex: 1,
    elevation: 3,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
