import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
    Modal,
    TextInput,
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import MiniAlert from '../(ProfileTabs)/MiniAlert';
import { Stack } from 'expo-router';


const { width } = Dimensions.get('window');

const ProductsScreen = () => {
    const [products, setProducts] = useState<{ id: string; name?: string; price?: number; description?: string; category?: string; image?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<{ id: string; name?: string; price?: number | string; description?: string; category?: string; image?: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const categories = ['All', 'Mobile & Tablet', 'Computers & Office Supplies', 'TVs & Electronics', "Men's Fashion", "Women's Fashion", 'Kids Fashion'];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsList: ((prevState: never[]) => never[]) | { id: string; }[] = [];
            querySnapshot.forEach((doc) => {
                productsList.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('خطأ', 'فشل في جلب المنتجات');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory);

    const searchedProducts = searchQuery
        ? filteredProducts.filter(product =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        : filteredProducts;

    const handleEdit = (product: { id: string; name?: string; price?: number | string; description?: string; category?: string; image?: string }) => {
        setEditingProduct(product);
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        if (!editingProduct || !editingProduct.name || !editingProduct.price || !editingProduct.description) {
            setAlertMessage("من فضلك ادخل بيانات المنتج كاملة");
            setAlertType("error");
            return;
        }

        try {
            await updateDoc(doc(db, 'products', editingProduct.id), {
                name: editingProduct.name,
                price: parseFloat(editingProduct.price.toString()),
                description: editingProduct.description,
                category: editingProduct.category,
                image: editingProduct.image,
            });
            setAlertMessage("تم تحديث المنتج بنجاح");
            setAlertType("success");
            fetchProducts();
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating product:', error);
            setAlertMessage("فشل في تحديث المنتج");
            setAlertType("error");
        }
    };

    const handleDelete = async (productId: string) => {
        Alert.alert(
            'حذف المنتج',
            'هل أنت متأكد من رغبتك في حذف هذا المنتج؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'products', productId));
                            fetchProducts();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            setAlertMessage("فشل في حذف المنتج");
                            setAlertType("error");
                        }
                    },
                },
            ]
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        setUploading(true);
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
                setEditingProduct(editingProduct ? { ...editingProduct, image: data.data.url } : null);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setAlertMessage("فشل في رفع الصورة");
            setAlertType("error");
        } finally {
            setUploading(false);
        }
    };

    const renderProductItem = ({ item }: { item: { id: string; name?: string; price?: number; description?: string; category?: string; image?: string } }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.priceContainer}>
                    <FontAwesome name="money" size={16} color="#4CAF50" />
                    <Text style={styles.productPrice}> ${item.price}</Text>
                </View>
                <View style={styles.categoryContainerItem}>
                    <MaterialCommunityIcons name="tag" size={16} color="#666" />
                    <Text style={styles.productCategory}>{item.category}</Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                    <Feather name="edit" size={22} color="#4a90e2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Feather name="trash-2" size={22} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <Stack.Screen name="ProductsScreen" options={{ headerShown: false }} />
            <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.container}>
                {
                    alertMessage && (
                        <MiniAlert
                            message={alertMessage}
                            type={alertType}
                            onHide={() => setAlertMessage(null)}
                        />
                    )
                }
                <View style={styles.header}>
                    <MaterialCommunityIcons name="package-variant" size={28} color="#4a90e2" />
                    <Text style={styles.title}>إدارة المنتجات</Text>
                </View>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="ابحث عن منتج..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScroll}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category && styles.selectedCategoryButton
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                {selectedCategory === category && (
                                    <MaterialCommunityIcons name="check" size={16} color="#fff" style={styles.categoryIcon} />
                                )}
                                <Text
                                    style={[
                                        styles.categoryText,
                                        selectedCategory === category && styles.selectedCategoryText
                                    ]}
                                >
                                    {category === 'All' ? 'الكل' : category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4a90e2" />
                    </View>
                ) : searchedProducts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="package-variant" size={50} color="#888" />
                        <Text style={styles.emptyText}>لا توجد منتجات</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchedProducts}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.productsList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4a90e2']}
                                tintColor="#4a90e2"
                                title="جاري التحديث..."
                                titleColor="#4a90e2"
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.modalContainer}>
                        {
                            alertMessage && (
                                <MiniAlert
                                    message={alertMessage}
                                    type={alertType}
                                    onHide={() => setAlertMessage(null)}
                                />
                            )
                        }
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>تعديل المنتج</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color="#2d3436" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {editingProduct?.image ? (
                                    <Image source={{ uri: editingProduct.image }} style={styles.imagePreview} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <MaterialCommunityIcons name="image-plus" size={40} color="#4a90e2" />
                                        <Text style={styles.imageText}>تغيير صورة المنتج</Text>
                                    </View>
                                )}
                                {uploading && (
                                    <View style={styles.uploadingOverlay}>
                                        <ActivityIndicator size="large" color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>اسم المنتج</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct?.name || ''}
                                    onChangeText={(text) => setEditingProduct(editingProduct ? { ...editingProduct, name: text } : null)}
                                    placeholder="اسم المنتج"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>السعر</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingProduct?.price?.toString() || ''}
                                    onChangeText={(text) => editingProduct && setEditingProduct({ ...editingProduct, price: text })}
                                    placeholder="السعر"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>الوصف</Text>
                                <TextInput
                                    style={[styles.input, styles.multilineInput]}
                                    value={editingProduct?.description || ''}
                                    onChangeText={(text) => editingProduct && setEditingProduct({ ...editingProduct, description: text })}
                                    placeholder="الوصف"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>التصنيف</Text>
                                <View style={styles.categoryOptions}>
                                    {categories.filter(c => c !== 'All').map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryOptionButton,
                                                editingProduct?.category === category && styles.selectedCategoryOption
                                            ]}
                                            onPress={() => editingProduct && setEditingProduct({ ...editingProduct, category })}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    editingProduct?.category === category && styles.selectedCategoryOptionText
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={handleUpdate}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.updateButtonText}>تحديث المنتج</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </LinearGradient>
                </Modal>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginLeft: 10,
        textAlign: 'center',
    },
    searchContainer: {
        backgroundColor: '#fff',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        textAlign: 'left',
        paddingRight: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    filterContainer: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
        textAlign: 'right',
    },
    categoryScroll: {
        paddingBottom: 5,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 25,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        minWidth: 80,
        justifyContent: 'center',
    },
    selectedCategoryButton: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    categoryText: {
        fontSize: 16,
        color: '#555',
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    categoryIcon: {
        marginLeft: 5,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 15,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2d3436',
        textAlign: 'right',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'flex-end',
    },
    productPrice: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    categoryContainerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
        marginRight: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    editButton: {
        padding: 8,
        marginRight: 5,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#ffebee',
        borderRadius: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginTop: 10,
    },
    productsList: {
        paddingBottom: 20,
    },
    modalContainer: {
        flex: 1,
        paddingTop: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    modalContent: {
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
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'right',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    categoryOptionButton: {
        padding: 10,
        margin: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedCategoryOption: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    categoryOptionText: {
        color: '#555',
    },
    selectedCategoryOptionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductsScreen;