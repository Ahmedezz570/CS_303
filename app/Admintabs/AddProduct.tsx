import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    ScrollView,
} from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Firebase';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MiniAlert from '../(ProfileTabs)/MiniAlert';
import { Stack } from 'expo-router';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Mobile & Tablet',
        image: ''
    });

    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const categories: { name: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
        { name: 'Mobile & Tablet', icon: 'cellphone' },
        { name: 'Computers & Office Supplies', icon: 'laptop' },
        { name: 'TVs & Electronics', icon: 'fridge' },
        { name: "Men's Fashion", icon: 'human-male' },
        { name: "Women's Fashion", icon: 'human-female' },
        { name: 'Kids Fashion', icon: 'human-child' },
        { name: 'Other', icon: 'shape' }
    ];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImagePreview(result.assets[0].uri);
            await uploadImage(result.assets[0].uri);
        }
    };


    async function uriToBase64(uri: string) {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    const uploadImage = async (uri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            const base64 = await uriToBase64(uri);
            formData.append('image', base64);
            const response = await fetch(
                'https://api.imgbb.com/1/upload?key=5f368fdc294d3cd3ddc0b0e9297a10fb',
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.success) {
                setProduct(p => ({ ...p, image: data.data.url }));
            } else {
                throw new Error(JSON.stringify(data));
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            setAlertMessage("فشل في رفع الصورة");
            setAlertType("error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!product.name || !product.price || !product.description || !product.image) {
            setAlertMessage("من فضلك ادخل بيانات المنتج كاملة");
            setAlertType("error");
            return;
        }

        try {
            const productId = Date.now().toString();
            await setDoc(doc(db, 'products', productId), {
                name: product.name,
                price: parseFloat(product.price),
                description: product.description,
                category: product.category,
                image: product.image,
                createdAt: new Date().toISOString(),
                AddedBy: auth.currentUser?.email,
            });

            setAlertMessage("تم إضافة المنتج بنجاح");
            setAlertType("success");
            resetForm();
        } catch (error) {
            console.error('Error adding product:', error);
            setAlertMessage("فشل في إضافة المنتج");
            setAlertType("error");
        }
    };

    const resetForm = () => {
        setProduct({
            name: '',
            price: '',
            description: '',
            category: 'Mobile & Tablet',
            image: ''
        });
        setImagePreview('');
    };

    return (
        <>
            <Stack.Screen name="AddProduct" options={{ headerShown: false }} />
            <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.container}>
                {alertMessage && (
                    <MiniAlert
                        message={alertMessage}
                        type={alertType}
                        onHide={() => setAlertMessage(null)}
                    />
                )}

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="plus-box" size={32} color="#4a90e2" />
                        <Text style={styles.title}>إضافة منتج جديد</Text>
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {imagePreview ? (
                            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <MaterialCommunityIcons name="image-plus" size={50} color="#4a90e2" />
                                <Text style={styles.imageText}>اختر صورة المنتج</Text>
                            </View>
                        )}
                        {uploading && (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={{ color: "#fff", marginTop: 10, fontWeight: 'bold' }}>
                                    جاري رفع الصورة...
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <MaterialCommunityIcons name="tag-outline" size={20} color="#4a90e2" />
                                <Text style={styles.label}>اسم المنتج</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={product.name}
                                onChangeText={(text) => setProduct({ ...product, name: text })}
                                placeholder="أدخل اسم المنتج"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <FontAwesome name="money" size={20} color="#4a90e2" />
                                <Text style={styles.label}>السعر</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={product.price}
                                onChangeText={(text) => setProduct({ ...product, price: text })}
                                placeholder="أدخل السعر"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="document-text-outline" size={20} color="#4a90e2" />
                                <Text style={styles.label}>وصف المنتج</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.multilineInput]}
                                value={product.description}
                                onChangeText={(text) => setProduct({ ...product, description: text })}
                                placeholder="أدخل وصف المنتج"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <MaterialCommunityIcons name="shape-outline" size={20} color="#4a90e2" />
                                <Text style={styles.label}>تصنيف المنتج</Text>
                            </View>
                            <View style={styles.categoryContainer}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.name}
                                        style={[
                                            styles.categoryButton,
                                            product.category === category.name && styles.selectedCategory
                                        ]}
                                        onPress={() => setProduct({ ...product, category: category.name })}
                                    >
                                        <MaterialCommunityIcons
                                            name={category.icon}
                                            size={20}
                                            color={product.category === category.name ? '#fff' : '#4a90e2'}
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                product.category === category.name && styles.selectedCategoryText
                                            ]}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Feather name="check-circle" size={22} color="#fff" />
                                <Text style={styles.submitButtonText}>إضافة المنتج</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginLeft: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageText: {
        marginTop: 10,
        color: '#4a90e2',
        fontSize: 16,
        fontWeight: '600',
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
        marginLeft: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    categoryButton: {
        padding: 10,
        margin: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedCategory: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    categoryText: {
        color: '#555',
        marginLeft: 5,
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default AddProduct;