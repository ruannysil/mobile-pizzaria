import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from './../../contexts/AuthContext';


export default function App() {
    const { signIn, loadingAuth } = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    async function handleLogin() {
        if (email === "" || password === "") {
            return;
        }

        await signIn({ email, password })
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../../assets/log.png')}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Digite seu email'
                    style={styles.input}
                    placeholderTextColor="#f0f0f0"
                    value={email}
                    onChangeText={setEmail}
                />
                <View style={styles.componetInput}>
                    <TextInput
                        placeholder='Sua senha'
                        style={styles.input}
                        placeholderTextColor="#f0f0f0"
                        secureTextEntry={!show}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={handleClick} style={styles.showPasswordButton}>
                        <MaterialIcons name={show ? 'visibility' : 'visibility-off'} size={24} color="#f0f0f0" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    {loadingAuth ? (
                        <ActivityIndicator size={25} color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Acessar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e',
    },
    logo: {
        marginBottom: 18,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 34,
        paddingHorizontal: 14
    },
    componetInput: {
        width: '100%',
        height: 55,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 14,
        color: '#fff'
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#ff3f4b',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    showPasswordButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
    },
})