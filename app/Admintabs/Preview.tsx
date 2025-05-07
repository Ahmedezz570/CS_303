import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Keyboard,
  Platform,
  UIManager,
  LayoutAnimation,
  ScrollView,
  RefreshControl,
  ListRenderItemInfo
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { db } from '../../Firebase/Firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import MiniAlert from '../(ProfileTabs)/MiniAlert';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

interface Product {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
}

interface EditingProduct extends Omit<Product, 'price'> {
  price?: string;
}

const Preview = () => {
  const [Products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>('success');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingb, setLoadingb] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [imageSourceModalVisible, setImageSourceModalVisible] = useState<boolean>(false);

  const categories = ['Mobile', 'Computers', 'TVs', "Men", "Women", 'Kids'];

  const colRef = collection(db, "products");

  const getProducts = async () => {
    try {
      setLoading(true);
      const querysnapshot = await getDocs(colRef);
      var productsArr = querysnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsArr);
      setAllProducts(productsArr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [refresh]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowKeyboard(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowKeyboard(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filteredProducts = [...allProducts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    if (activeFilter) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      switch (activeFilter) {
        case 'price_low_high':
          filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_high_low':
          filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'name_a_z':
          filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'name_z_a':
          filteredProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
      }
    }

    setProducts(filteredProducts);
  }, [searchQuery, activeFilter, allProducts]);

  const handleFilterToggle = (filter: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const clearSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const deleteProduct = async (item: Product) => {
    setLoadingb(true);
    try {
      const docRef = doc(db, 'products', item.id);
      await deleteDoc(docRef);
      setAlertMsg('Product deleted successfully');
      setTimeout(() => {
        setModalVisible(false);
        setRefresh(!refresh);
      }, 3000);
    } catch (err) {
      console.error(err);
      setAlertMsg('Failed to delete product');
    } finally {
      setLoadingb(false);
    }
  };

  const handleEdit = (item: Product) => {
    setEditingProduct({ ...item, price: item.price?.toString() || '0' });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.price || !editingProduct.description) {
      setAlertMsg("Please enter all product details");
      setAlertType("error");
      return;
    }

    setLoadingb(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        description: editingProduct.description,
        category: editingProduct.category,
        image: editingProduct.image,
      });
      setAlertMsg("Product updated successfully");
      setAlertType("success");
      setTimeout(() => {
        setEditModalVisible(false);
        setRefresh(!refresh);
      }, 3000);
    } catch (error) {
      console.error('Error updating product:', error);
      setAlertMsg("Failed to update product");
      setAlertType("error");
    } finally {
      setLoadingb(false);
    }
  };

  const pickImageFromGallery = async () => {
    setImageSourceModalVisible(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    setImageSourceModalVisible(false);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      setAlertMsg('You need to allow camera access to take photos.');
      setAlertType('error');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const pickImage = () => {
    setImageSourceModalVisible(true);
  };

  const uploadImage = async (uri: string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'product.jpg',
      } as any);

      const response = await fetch(
        'https://api.imgbb.com/1/upload?key=5f368fdc294d3cd3ddc0b0e9297a10fb',
        {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const data = await response.json();
      if (data.success) {
        setEditingProduct({ ...editingProduct!, image: data.data.url });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setAlertMsg("Failed to upload image");
      setAlertType("error");
    } finally {
      setUploadingImage(false);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Product>) => {
    const isExpanded = expanded === item.id;
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['#E6F7FF', '#FFFFFF']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              ) : (
                <View style={[styles.productImage, styles.noImagePlaceholder]}>
                  <MaterialIcons name="image-not-supported" size={24} color="#bbb" />
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              {item.name && item.name.length > 20 ? (
                isExpanded ? (
                  <View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => setExpanded(null)}>
                      <Text style={styles.readMore}>Show less</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.productName}>{item.name.substring(0, 20)}...</Text>
                    <TouchableOpacity onPress={() => setExpanded(item.id)}>
                      <Text style={styles.readMore}>Read more</Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                <Text style={styles.productName}>{item.name || 'No Name'}</Text>
              )}

              <View style={styles.priceContainer}>
                <FontAwesome name="dollar" size={16} color="#4CAF50" />
                <Text style={styles.priceText}>{(item.price || 0).toFixed(2)}</Text>
              </View>

              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => {
                setSelectedProduct(item);
                setModalVisible(true);
              }}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => handleEdit(item)}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    setActiveFilter(null);
    getProducts();
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading Products...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {alertMsg && (
            <MiniAlert
              message={alertMsg}
              type="error"
              onHide={() => setAlertMsg(null)}
            />
          )}

          <Modal
            visible={modalVisible}
            animationType='slide'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <MaterialIcons name="warning" size={36} color="#f39c12" />
                  <Text style={styles.modalTitle}>Delete {selectedProduct?.name ? String(selectedProduct.name).split(' ').slice(0, 2).join(' ') : ''}</Text>
                </View>

                <Text style={styles.modalText}>
                  Are you sure you want to delete this product? This action cannot be undone.
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => selectedProduct && deleteProduct(selectedProduct)}
                    disabled={loadingb}
                  >
                    {loadingb ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Delete</Text>)}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.header}>
            <Entypo name="list" size={24} color="#2d3436" />
            <Text style={styles.title}>Products List</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={[
              styles.searchInputContainer,
              isSearchFocused && styles.searchInputFocused
            ]}>
              <MaterialIcons name="search" size={22} color="#888" style={styles.searchIcon} />
              <TextInput
                placeholder='Search products...'
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  if (!showKeyboard) setIsSearchFocused(false);
                }}
                onChangeText={(text) => setSearchQuery(text)}
                style={styles.searchInput}
                value={searchQuery}
                placeholderTextColor="#999"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'price_low_high' && styles.activeFilterButton
                ]}
                onPress={() => handleFilterToggle('price_low_high')}
              >
                <FontAwesome
                  name="sort-amount-asc"
                  size={16}
                  color={activeFilter === 'price_low_high' ? '#fff' : '#333'}
                />
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === 'price_low_high' && styles.activeFilterText
                ]}>
                  Price: Low to High
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'price_high_low' && styles.activeFilterButton
                ]}
                onPress={() => handleFilterToggle('price_high_low')}
              >
                <FontAwesome
                  name="sort-amount-desc"
                  size={16}
                  color={activeFilter === 'price_high_low' ? '#fff' : '#333'}
                />
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === 'price_high_low' && styles.activeFilterText
                ]}>
                  Price: High to Low
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'name_a_z' && styles.activeFilterButton
                ]}
                onPress={() => handleFilterToggle('name_a_z')}
              >
                <FontAwesome
                  name="sort-alpha-asc"
                  size={16}
                  color={activeFilter === 'name_a_z' ? '#fff' : '#333'}
                />
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === 'name_a_z' && styles.activeFilterText
                ]}>
                  Name: A to Z
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'name_z_a' && styles.activeFilterButton
                ]}
                onPress={() => handleFilterToggle('name_z_a')}
              >
                <FontAwesome
                  name="sort-alpha-desc"
                  size={16}
                  color={activeFilter === 'name_z_a' ? '#fff' : '#333'}
                />
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === 'name_z_a' && styles.activeFilterText
                ]}>
                  Name: Z to A
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {Products.length} {Products.length === 1 ? 'product' : 'products'} found
            </Text>
          </View>

          {Products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inventory" size={50} color="#777" />
              <Text style={styles.emptyText}>
                {allProducts.length === 0 ? 'No products available' : 'No products match your search'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={Products}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#4a90e2']}
                  tintColor="#4a90e2"
                />
              }
            />
          )}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <LinearGradient colors={['#D1F4FF', '#f5ffff']} style={styles.editModalContainer}>
          {alertMsg && (
            <MiniAlert
              message={alertMsg}
              type={alertType || 'success'}
              onHide={() => setAlertMsg(null)}
            />
          )}
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Edit Product</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={28} color="#2d3436" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.editModalContent}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {editingProduct?.image ? (
                <Image source={{ uri: editingProduct.image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="add-photo-alternate" size={40} color="#4a90e2" />
                  <Text style={styles.imageText}>Change Product Image</Text>
                </View>
              )}
              {uploadingImage && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={[styles.input, { textAlignVertical: 'top' }]}
                value={editingProduct?.name || ''}
                onChangeText={(text) => setEditingProduct(editingProduct ? { ...editingProduct, name: text } : null)}
                placeholder="Product Name"
                multiline={true}
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={editingProduct?.price?.toString() || ''}
                onChangeText={(text) => setEditingProduct(editingProduct ? { ...editingProduct, price: text } : null)}
                placeholder="Price"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={editingProduct?.description || ''}
                onChangeText={(text) => setEditingProduct(editingProduct ? { ...editingProduct, description: text } : null)}
                placeholder="Description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={editingProduct?.category || ''}
                  onValueChange={(itemValue) => setEditingProduct(editingProduct ? { ...editingProduct, category: itemValue } : null)}
                  style={{ color: '#000' }}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((category, index) => (
                    <Picker.Item key={index} label={category} value={category} />
                  ))}
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={styles.updateProductButton}
              onPress={handleUpdate}
              disabled={loadingb || uploadingImage}
            >
              {loadingb ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateProductButtonText}>Update Product</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={imageSourceModalVisible}
        onRequestClose={() => setImageSourceModalVisible(false)}
      >
        <View style={styles.imageSourceModalOverlay}>
          <View style={styles.imageSourceModalContent}>
            <Text style={styles.imageSourceModalTitle}>Select Image Source</Text>

            <View style={styles.imageSourceOptions}>
              <TouchableOpacity
                style={styles.imageSourceOption}
                onPress={pickImageFromGallery}
              >
                <FontAwesome name="photo" size={40} color="#4a90e2" />
                <Text style={styles.imageSourceOptionText}>From Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageSourceOption}
                onPress={takePhotoWithCamera}
              >
                <FontAwesome name="camera" size={40} color="#4a90e2" />
                <Text style={styles.imageSourceOptionText}>By Camera</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.imageSourceCancelButton}
              onPress={() => setImageSourceModalVisible(false)}
            >
              <Text style={styles.imageSourceCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#2d3436',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginLeft: 10,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputFocused: {
    borderColor: 'purple',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  filterScroll: {
    paddingRight: 15,
    paddingVertical: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#add8e6',
  },
  activeFilterButton: {
    backgroundColor: 'purple',
    borderColor: '#9370db',
  },
  filterButtonText: {
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    padding: 16,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 15,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  noImagePlaceholder: {
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  readMore: {
    fontSize: 12,
    color: 'purple',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  updateButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#ff6b6b',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editModalContainer: {
    flex: 1,
    paddingTop: 15,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  editModalContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    marginTop: 10,
    color: '#4a90e2',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginTop: 5,
    justifyContent: 'center',
  },
  updateProductButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateProductButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageSourceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSourceModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageSourceModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d3436',
  },
  imageSourceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  imageSourceOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    width: '45%',
  },
  imageSourceOptionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  imageSourceCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
  },
  imageSourceCancelText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
});

export default Preview;