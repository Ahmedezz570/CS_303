import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db, getUserData } from '../../Firebase/Firebase';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import MiniAlert from '../(ProfileTabs)/MiniAlert';


interface User {
    isAdmin?: boolean;
}

interface Order {
    status?: 'pending' | 'delivering' | 'delivered';
    total?: number;
}

interface Product {
    category?: string;
}

const Admin = () => {
    const [adminName, setAdminName] = useState('Admin');
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const router = useRouter();

    const fetchData = async () => {
        try {
            const [usersSnap, ordersSnap, productsSnap] = await Promise.all([
                getDocs(collection(db, 'Users')),
                getDocs(collection(db, 'Orders')),
                getDocs(collection(db, 'products'))
            ]);

            setUsers(usersSnap.docs.map(d => d.data() as User));
            setOrders(ordersSnap.docs.map(d => d.data() as Order));
            setProducts(productsSnap.docs.map(d => d.data() as Product));
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            await fetchData();
            const user = auth.currentUser;
            if (user) {
                const data = await getUserData(user.uid);
                setAdminName(data?.username);
            }
        };
        fetchUserData();
    }, []);

    const logout = () => {
        auth.signOut();
        setAlertMessage("تم تسجيل الخروج بنجاح");
        setAlertType("error");
        setTimeout(() => {
            router.replace("../Login");
        }, 3000);
    };

    const deliveredCount = orders.filter(o => o.status === 'delivered').length;
    const deliveringCount = orders.filter(o => o.status === 'delivering').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.isAdmin).length;
    const productCategories = [
        { name: 'Mobile & Tablet', icon: 'cellphone' },
        { name: 'Computers & Office Supplies', icon: 'laptop' },
        { name: 'TVs & Electronics', icon: 'fridge' },
        { name: "Men's Fashion", icon: 'human-male' },
        { name: "Women's Fashion", icon: 'human-female' },
        { name: 'Kids Fashion', icon: 'human-child' },
        { name: 'Other', icon: 'shape' }
    ];

    const categorizedProducts = products.reduce<Record<string, number>>((acc, p) => {
        const validCategories = ['Mobile & Tablet', 'Computers & Office Supplies', 'TVs & Electronics', "Men's Fashion", "Women's Fashion", 'Kids Fashion'];
        const cat = p.category && validCategories.includes(p.category) ? p.category : 'أخرى';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    if (loading && !refreshing) {
        return (
            <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
            </LinearGradient>
        );
    }

    return (
        <>
            <Stack.Screen name="Admin" options={{ headerShown: false }} />
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
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']}
                            tintColor="#fff"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.header}>
                        لوحة التحكم، مرحباً {String(adminName).toUpperCase()} 👋
                    </Text>


                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="people-alt" size={24} color="#4a90e2" />
                            <Text style={styles.sectionTitle}>المستخدمين</Text>
                        </View>
                        <View style={styles.innerRow}>
                            <View style={[styles.halfCard, styles.cardWithIcon]}>
                                <FontAwesome name="users" size={20} color="#4a90e2" />
                                <Text style={styles.cardLabel}>إجمالي المستخدمين</Text>
                                <Text style={styles.cardValue}>{totalUsers}</Text>
                            </View>
                            <View style={[styles.halfCard, styles.cardWithIcon]}>
                                <Ionicons name="shield-checkmark" size={20} color="#4a90e2" />
                                <Text style={styles.cardLabel}>المشرفين</Text>
                                <Text style={styles.cardValue}>{adminCount}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="clipboard-list" size={24} color="#4a90e2" />
                            <Text style={styles.sectionTitle}>الطلبات</Text>
                        </View>
                        <View style={styles.innerRow}>
                            <View style={[styles.thirdCard, styles.cardWithIcon]}>
                                <MaterialIcons name="pending-actions" size={20} color="#4a90e2" />
                                <Text style={styles.cardLabel}>قيد الانتظار</Text>
                                <Text style={styles.cardValue}>{pendingCount}</Text>
                            </View>
                            <View style={[styles.thirdCard, styles.cardWithIcon]}>
                                <MaterialCommunityIcons name="truck-delivery" size={20} color="#4a90e2" />
                                <Text style={styles.cardLabel}>قيد التوصيل</Text>
                                <Text style={styles.cardValue}>{deliveringCount}</Text>
                            </View>
                            <View style={[styles.thirdCard, styles.cardWithIcon]}>
                                <Ionicons name="checkmark-done-circle" size={20} color="#4a90e2" />
                                <Text style={styles.cardLabel}>مكتملة</Text>
                                <Text style={styles.cardValue}>{deliveredCount}</Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="package-variant" size={24} color="#4a90e2" />
                            <Text style={styles.sectionTitle}>المنتجات حسب الأقسام</Text>
                            <Text style={styles.totalProductsCount}>إجمالي المنتجات: {products.length}</Text>
                        </View>
                        <View style={styles.wrap}>
                            {productCategories.map((category, i) => {
                                const count = categorizedProducts[category.name] || 0;
                                return (
                                    <View key={i} style={[styles.categoryCard, styles.cardWithIcon]}>
                                        <MaterialCommunityIcons
                                            name={category.icon as any}
                                            size={24}
                                            color="#4a90e2"
                                        />
                                        <Text style={styles.categoryLabel}>{category.name}</Text>
                                        <Text style={styles.categoryValue}>{count}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
    );
};

export default Admin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 16
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
        fontWeight: '500'
    },
    logoutBtn: {
        position: 'absolute',
        top: 40,
        right: 16,
        backgroundColor: 'rgba(74, 144, 226, 0.7)',
        padding: 8,
        borderRadius: 20,
        zIndex: 1
    },
    scrollContent: {
        paddingBottom: 80
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 20
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3436',
        marginRight: 8
    },
    totalProductsCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4a90e2',
        marginLeft: 8,
        marginTop: 6,
    },
    innerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    halfCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center'
    },
    thirdCard: {
        width: '30%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10
    },
    categoryCard: {
        width: '30%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center'
    },
    cardWithIcon: {
        justifyContent: 'center',
        paddingVertical: 16
    },
    cardLabel: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500'
    },
    categoryLabel: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginTop: 6,
        fontWeight: '500'
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
        marginTop: 8
    },
    categoryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
        marginTop: 4
    },
    wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10
    }
});
