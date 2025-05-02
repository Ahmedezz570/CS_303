import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/Firebase';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const AddProduct = () => {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;
  console.log('Current User:', currentUser.email);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: '',
    description: '',
    price: '',
    createdAt: new Date(),
    AddedBy: currentUser.email,
  });

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();

      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });

      formData.append('upload_preset', 'photos');


      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dtxvpdxsb/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setImage(data.secure_url);
        setProductDetails({ ...productDetails, image: data.secure_url });
        setLoading(false);
      } catch (error) {
        console.log('Upload error:', error);

      }
    }
  };

  const changeHandler = (name, value) => {
    setProductDetails({ ...productDetails, [name]: value });
  };

  const addButton = async () => {
    if (!productDetails.image) {
      Alert.alert("Image Required", "Please upload an image before submitting.");
      return;
    }
    setLoading(true)
    try {

      const newProduct = { ...productDetails };
      await addDoc(collection(db, 'products'), newProduct);

      ToastAndroid.showWithGravityAndOffset(
        'Product added successfully',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );

      setProductDetails({
        name: '',
        image: '',
        category: '',
        description: '',
        price: '',
        createdAt: new Date(),
        AddedBy: currentUser.email,
      });
      setImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error('Error adding product: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Product</Text>

      <Text style={styles.label}>Product Title</Text>
      <TextInput
        style={styles.input}
        value={productDetails.name}
        onChangeText={(text) => changeHandler('name', text)}
        placeholder="Enter here"
      />

      <Text style={styles.label}>Product Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={productDetails.category}
          onValueChange={(itemValue) => changeHandler('category', itemValue)}
          style={{ color: '#000' }}
        >
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="Mobile" value="Mobile" />
          <Picker.Item label="Computers" value="Computers" />
          <Picker.Item label="TVs" value="TVs" />
          <Picker.Item label="Men" value="Men" />
          <Picker.Item label="Women" value="Women" />
          <Picker.Item label="Kids" value="Kids" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={styles.label}>Product Description</Text>
      <TextInput
        style={styles.input}
        value={productDetails.description}
        onChangeText={(text) => changeHandler('description', text)}
        placeholder="Enter here"
      />

      <Text style={styles.label}>Product Price</Text>
      <TextInput
        style={styles.input}
        value={productDetails.price}
        onChangeText={(text) => changeHandler('price', text)}
        keyboardType="numeric"
        placeholder="Enter here"
      />

      <TouchableOpacity onPress={pickAndUploadImage} style={styles.imagePicker}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <FontAwesome name="cloud-upload" size={50} color="#aaa" />
        )}
      </TouchableOpacity>


      <TouchableOpacity onPress={addButton} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Add</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    marginTop: 5,
  },
  imagePicker: {
    alignItems: 'center',
    marginTop: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#f5e1d2',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginTop: 5,
    justifyContent: 'center',
  },
});

export default AddProduct;
