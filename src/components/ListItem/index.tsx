import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';

interface ItemProps {
    data: {
        id: string;
        product_id: string;
        name: string;
        amount: string | number;
    };
    deleteItem: (item_id: string) => void;
}


export default function ListItem({data, deleteItem}:ItemProps) {
    
    function handleDeleteItem(){
        deleteItem(data.id)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{data.amount} - {data.name}</Text>
            {/* <Image source={{ uri:`${api.defaults.baseURL}/files/${data?.banner}`}} style={styles.image} /> */}

            <TouchableOpacity onPress={handleDeleteItem}>
                <Feather name='trash-2' color="#ff3f4b" size={25} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#101026",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 0.9,
        borderColor: '#8a8a8a'
    },
    text:{
        color: '#fff'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    }
})

