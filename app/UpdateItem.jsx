import { View, Text, ActivityIndicator, Image, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { db } from '../Firebase/Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const UpdateItem = () => {
  const { id } = useLocalSearchParams()
  const [item, setItem] = useState(null)
  const [Productname, setProductName] = useState()
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState()
  const [desc, setDesc] = useState()


  useEffect(() => {
    getItem()
  }
    , [])


  const getItem = async () => {
    try {
      const colRef = doc(db, 'products', id)
      const thedoc = await getDoc(colRef)
      const data =thedoc.data()
      setItem({ id: thedoc.id, ...thedoc.data() })

      setProductName(data.name)
      setPrice(String(data.price))
      setCategory(data.category)
      setDesc(data.description)
    }
    catch (err) {
      console.error(err)
    }

  }
  const update =async()=>{
    const colRef = doc(db, 'products', id)

    if (!Productname || !price || isNaN(price)) {
      Alert.alert('Please fill all fields correctly')
      return
    }
    try {
      await updateDoc(colRef,{
        name : Productname,
        price: parseFloat(price),
        category : category ,
        description: desc
       })
       Alert.alert('Updated successfully ✌️')
    }
    catch(err){
      console.error(err)
    }
  }

  return (

    <ScrollView style={styles.container}>
      {item === null
        ?
        <ActivityIndicator size='large' color='red' /> :
        <View>
          <View style={styles.imgbox}>
            <Image source={{ uri: item.image }} style={styles.img} />
          </View>
          <Text style={styles.txt}> Name :</Text>
          <TextInput
            placeholder='Write Name'
            value={Productname}
            style={styles.input}
            multiline
            onChangeText={(t)=> setProductName(t)}
          />
       
          <Text style={styles.txt}> Price :</Text>
          <TextInput
            placeholder='Write Price'
            value={price}
            style={styles.input}
            onChangeText={t => setPrice(t)}

          />
          <Text style={styles.txt}> Category :</Text>
          <TextInput
            placeholder='Write Category'
            value={category}
            style={styles.input}
            onChangeText={t => setCategory(t)}
          />
          <Text style={styles.txt}> Description :</Text>
          <TextInput
            placeholder='Write Description'
            value={desc}
            style={styles.input}
            multiline
            onChangeText={t => setDesc(t)}
          />
             <View style={styles.Ubtn}>
          <Button title='update' onPress={update} />
          </View>
        </View>
      }
    </ScrollView>
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAE5D3',
  },
  Ubtn:{
    width:'25%',
    alignSelf:'center',
    marginVertical:20,
    // display:'none'
  },
  img: {
    width: 100,
    height: 100,
    alignSelf: 'center',

  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20
  },
  imgbox: {
    backgroundColor: 'white',
    width: '50%',
    alignSelf: 'center',
    paddingVertical: 20,
    marginTop:10
  },
  input: {
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    borderRadius: 15,
    // paddingVertical: 10,
  }
})

export default UpdateItem