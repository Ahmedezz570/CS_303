import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { auth } from '../Firebase/Firebase';

const Favorites = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      router.replace('/Login');
    } else {
      router.replace('/(ProfileTabs)/Wishlist');
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E91E63" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Favorites;