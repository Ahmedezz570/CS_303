import { View, Text, StyleSheet, Pressable, TextInput, FlatList, Alert, Dimensions } from 'react-native'
import { useRouter, router } from 'expo-router';
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { SearchBar } from 'react-native-screens';
import data from '../data';
import Item from './item'


const { width } = Dimensions.get("window");
const Home = () => {
  const router = useRouter();
  const renderitem = ({ item }) => {
    return (
      <Item
        item={item}>

      </Item>
    )
  }
  return (
    <View>
      <Text style={styles.text}> Discver </Text>
      <View style={styles.icons}>
        <Pressable onPress={() => router.push('/profile')}>
          <FontAwesome name="user" size={30} color="white" style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => router.push('/cart')}>
          <FontAwesome6 name="bucket" size={24} color="black" style={styles.icon} />
        </Pressable>
      </View>
      <View style={styles.SearchBar}>
        <FontAwesome name='search' size={20} style={{ alignSelf: 'center', marginLeft: '3%' }} />
        <TextInput
          placeholder='Serach'
        />

      </View>
      <View style={styles.texts}>
        <Text style={styles.text}> Categoies</Text>
        <Text style={styles.text}> See All </Text>

      </View>
      <FlatList
        data={data}
        renderItem={renderitem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      <View>
        <Text style={styles.text}> Top selling</Text>
        <FlatList
          data={data}
          renderItem={renderitem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>


    </View>
  )
}
const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "90%",
    margin: "auto",
    marginTop: '5%'
  },
  icon: {
    backgroundColor: "gray",
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    padding: 8,
    fontSize: 20,
    color: 'white'
  },
  SearchBar: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    width: '90%',
    margin: 'auto',
    marginTop: '5%',
    borderRadius: 30,
    padding: '1.5%',
  },
  texts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    margin: 'auto',
    fontWeight: 'bold',
    marginTop: '2%',
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: "cursive"
  }
})

export default Home;