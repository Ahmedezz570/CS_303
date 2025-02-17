import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Link , Stack} from "expo-router";
const Home = () => {

    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>

            <Text>Supermall App!</Text>

            <Link href={"/Login"} >
                <Text>SignIn </Text>
            </Link>
            <Link href={"/Register"} >
                <Text> SignUp </Text>
            </Link>
        </View>
        </>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Home;