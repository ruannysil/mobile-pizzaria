import React, { useContext, useState } from 'react';

import { Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';
import { api } from '../../services/api';


export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList >>();
    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    
    async function openOrder() {
        if(number === ""){
            return;
        }    
        
        const response = await api.post('/order', {
            table: Number(number),
        })

        if(name.trim() !== '') {
            response.data.name = name;
        }

        console.log(response.data);
        navigation.navigate('Order', {number: number, order_id: response.data.id})
        
        setName('')
        setNumber('')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>

            <TextInput 
            placeholder='Número da mesa'
            placeholderTextColor={"#FFF"}
            style={styles.input}
            keyboardType='numeric'
            value={number}
            onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir Mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15, 
        backgroundColor: '#1d1d2d',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 28
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#fff',
        marginBottom: 13
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#ff3f4b',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        // marginVertical: 18
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    }
})