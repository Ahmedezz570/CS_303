import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Order = () => {
    return (
        <>
            <Stack.Screen name="Order" options={{ headerShown: false }} />
            <View>
                <Text>Order</Text>
            </View>
        </>
    )
}


export default Order



