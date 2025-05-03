import { View, Text, TextInput, StyleSheet, FlatList, Image, Pressable, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { db } from '../../Firebase/Firebase'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';


const Preview = () => {
  const [Products, setProuducts] = useState([])
  const [allProducts, setAllProuducts] = useState([])
  const [text, setText] = useState()
  const [expanded, setExpanded] = useState(null)
  const [visiable, setVisiable] = useState(false)
  const [deletedId, setDeletedId] = useState()
  const [render, setRender] = useState(false)
  const [activity,setActivity] =useState(true)

  const colRef = collection(db, "products")
  const getProducts = async () => {
    try {
      const querysnapshot = await getDocs(colRef)
      var productsArr = querysnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }
      ))
      setProuducts(productsArr)
      setAllProuducts(productsArr)
      setActivity(false)
    }
    catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    getProducts()
  }, [render])

  const renderItem = ({ item }) => {
    const isExpanded = expanded === item.id
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={{ width: 100, height: 120, resizeMode: 'cover' }} />
        {item.name.length > 15 ? (
          isExpanded ? (
            <View>
              <Text> {item.name}</Text>
              <Pressable onPress={() => setExpanded(null)}>
                <Text style={{ fontSize: 12, color: 'gray' }}>Show less </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text>{item.name.substring(0, 15)}... </Text>
              <Pressable onPress={() => setExpanded(item.id)}>
                <Text style={{ fontSize: 12, color: 'gray' }}> Read more </Text>
              </Pressable>
            </View>
          )) : (
          <View>
            <Text> {item.name}</Text>
            <Text></Text>
          </View>
        )
        }
        <View style={styles.btn}>
          <Pressable
            style={[styles.Pressable, { backgroundColor: 'red' }]}
            onPress={() => {
              setVisiable(true)
              setDeletedId(item)
            }}
          >
            <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.txt}> Delete</Text>
          </Pressable>
          <Pressable
            style={[styles.Pressable, { backgroundColor: 'lightblue' }]}
            onPress={() => router.push({ pathname: 'UpdateItem', params: { id: item.id } })}
          >
            <MaterialIcons name="update" size={24} color="black" />
            <Text style={styles.txt}> Update</Text>
          </Pressable>
        </View>
      </View>
    )
  }


  const search = (txt) => {
    if (txt.trim().length === 0) {
      setProuducts(allProducts)
    }
    else {
      setProuducts(allProducts.filter(item => item.name.toLowerCase().includes(txt.toLowerCase())))
    }
  }
  // setTimeout(()=> Del)
  const Del = async (item) => {
    try {
      const docum = doc(db, 'products', item.id)
      await deleteDoc(docum)
      Alert.alert('deleted successfully')
    }
    catch (err) {
      console.error(err)
    }

    setVisiable(false)
    setRender(!render)
  }

  return (

    <View style={styles.container}>
      {activity ?
    <ActivityIndicator size='large' color='red' style={{justifyContent:'center',flex:1}}/>
    :<View>
      <Modal
        visible={visiable}
        animationType='slide'
        transparent={true}
        onRequestClose={() => {
          setVisiable(!visiable)
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: 300, paddingVertical: 40, borderRadius: 20, backgroundColor: 'white', shadowColor: 'gray', shadowOpacity: 0.7 }}>
            <Text style={[styles.Mbtn, { alignSelf: 'center', }]}>
              Are you sure ?
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginHorizontal: 'auto', marginTop: 20, alignItems: 'center' }}>
              <Pressable
                style={{ backgroundColor: 'red', padding: 10, borderRadius: 12 }}
                onPress={() => Del(deletedId)}
              >
                <Text style={[styles.Mbtn]}> Delete1 </Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor: 'lightblue', padding: 10, borderRadius: 12 }}
                onPress={() => setVisiable(false)}
              >
                <Text style={styles.Mbtn}> Cancel </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="black" />
        <TextInput
          placeholder='Serach ...'
          onChangeText={t => {
            setText(t)
            search(t)
          }}
          style={styles.input}
          value={text}
          placeholderTextColor={'gray'}
        />
      </View>
      <FlatList
        data={Products}
        renderItem={(item) => renderItem(item)}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 80 }} 
      />
      </View>
        }
    </View>
        
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAE5D3',
  },
  Mbtn: {
    fontWeight: 'bold',
    fontSize: 18
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    marginVertical: 15,
    width: '90%',
    marginHorizontal: 'auto',
    borderRadius: 20,
    paddingLeft: 15,
    paddingVertical: 4

  },
  txt: {
    // marginLeft: 2,
    fontWeight: 'bold',
    fontSize: 12
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  Pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    width: '48%',
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 10
  },

  card: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    margin: 8,
    padding: 10,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    alignSelf: 'center'
  },
  input: {
    // borderWidth: 1.5,
    width: '90%',
    // alignSelf: 'center',
    // borderRadius: 20,
    // marginVertical: 15,
    paddingLeft: 8,
  }
})

export default Preview