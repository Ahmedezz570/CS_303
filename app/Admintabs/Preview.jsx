import { View, Text, TextInput, StyleSheet, FlatList, Image, Pressable, Alert, Modal, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { db } from '../../Firebase/Firebase'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import MiniAlert from '../(ProfileTabs)/MiniAlert'


const Preview = () => {
  const [Products, setProuducts] = useState([])
  const [allProducts, setAllProuducts] = useState([])
  const [text, setText] = useState()
  const [expanded, setExpanded] = useState(null)
  const [visiable, setVisiable] = useState(false)
  const [deletedId, setDeletedId] = useState()
  const [render, setRender] = useState(false)
  const [activity, setActivity] = useState(true)
  const [hoverd, setHoverd] = useState(false)
  const [alertMsg, setAlertMsg] = useState  (null)
  const [showKeybord, setShowKeybord] = useState(false)

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

  useEffect(() => {
    const KeybordIsShown = Keyboard.addListener('keyboardDidShow', () => {
      setShowKeybord(true)
    })
    const KeybordIsHide = Keyboard.addListener('keyboardDidHide', () => {
      setShowKeybord(false)
    })
    return () => {
      KeybordIsShown.remove()
      KeybordIsHide.remove()
    }
  })

  const renderItem = ({ item }) => {
    const isExpanded = expanded === item.id
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={{ width: 100, height: 120, resizeMode: 'cover', marginBottom: 10 }} />
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
      const LowerText = txt.toLowerCase()
      setProuducts(allProducts.filter(item => item.name.toLowerCase().includes(LowerText)))
    }
  }

  const Del = async (item) => {
    try {
      const docum = doc(db, 'products', item.id)
      await deleteDoc(docum)
    }
    catch (err) {
      console.error(err)
    }
    
    setAlertMsg('Delete Product Successfully')
    setVisiable(false)
    setRender(!render)
  }

  return (

    <View style={styles.container}>
      {activity ?
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading Products...</Text>
        </View>
        : <View>
          { alertMsg &&
            <MiniAlert
              message={"Delete Product Successfully"}
              type={"success"}
              onHide={()=> setAlertMsg(null)}
            />
          }
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
                    <Text style={[styles.Mbtn]}> Delete </Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 35, marginBottom: 20 }}>
            <Entypo name="list" size={24} color="black" />
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}> Products List </Text>
          </View>
          <TouchableWithoutFeedback onPress={() => showKeybord && Keyboard.dismiss()}>
            <View
              style={[styles.searchBar, showKeybord && styles.hover]}
            >
              <FontAwesome name="search" size={20} color="gray" />
              <TextInput
                placeholder='Serach ...'
                onFocus={() => setHoverd(true)}
                onBlur={() => {
                  if (!showKeybord)
                    setHoverd(false)
                }}
                onChangeText={t => {
                  setText(t)
                  search(t)
                }}
                style={styles.input}
                value={text}
                placeholderTextColor={'gray'}
              />
            </View>
          </TouchableWithoutFeedback>

          <FlatList
            data={Products}
            renderItem={renderItem}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAE5D3',
  },
  loadingText: {
    color: '#2d3436',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    marginVertical: 15,
    borderColor: '#ccc',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: '#fff',

  },
  hover: {
    elevation: 30,
    borderWidth: 1.2,
    borderColor: '#6200ee',
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
    gap: 10
  },
  Pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },


  card: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 15,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
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
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
  },

  cancelBtn: {
    backgroundColor: '#3498db',
  },
})

export default Preview