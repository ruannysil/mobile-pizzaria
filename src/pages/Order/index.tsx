import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image, FlatList } from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { useEffect } from 'react';
import ModalPicker from '../../components/ModalPicker';
import ListItem from '../../components/ListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';

type RouterDetailParams = {
    Order: {
        number: number | string;
        order_id: string;
    }
}

export type CategoryProps = {
    id: string;
    name: string;
    banner?: string;
}

export type ProductsProps = {
    id: string,
    name: string,
    banner?: string;
}

type ItemProps = {
    length?: number;
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

type OrderRouterProps = RouteProp<RouterDetailParams, 'Order'>;

export default function Order() {
    const router = useRoute<OrderRouterProps>()
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>()

    const [category, setCategory] = useState<CategoryProps[] | []>([])
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

    const [products, setProducts] = useState<ProductsProps[] | []>([])
    const [productSelected, setProductSelected] = useState<ProductsProps | undefined>()
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState<ItemProps[]>([])



    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category')
            setCategory(response.data)
            setCategorySelected(response.data[0])

        }
        loadInfo();
    }, [])


    useEffect(() => {
        async function loadProduct() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id,
                }
            })
            const banner = response.data.map((item: { banner: any; }) => item.banner);
            console.log(banner)
            // console.log(response.data)
            setProducts(response.data)
            setProductSelected(response.data[0])
        }
        loadProduct();
    }, [categorySelected])

    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: router.params?.order_id,
                }
            })
            navigation.goBack();
        } catch (err) {
            console.log('Ocorreu um erro ao deletar pedido ', err)
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item)
    }

    function handleChangeProduct(item: ProductsProps) {
        setProductSelected(item)
    }

    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: router.params?.order_id,
            product_id: productSelected?.id,
            banner: productSelected?.banner,
            amount: Number(amount)
        })

        const data = {
            id: response.data.id as string,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data])
    }

    async function handleDeleteItem(item_id: string) {
        await api.delete('/order/remove', {
            params: {
                item_id: item_id
            }
        })

        const removeItem = items.filter(item => {
            return (item.id !== item_id)
        })

        setItems(removeItem)

    }

    function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            number: router.params.number,
            order_id: router.params.order_id
        })

    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Mesa {router.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#ff3f4b" />
                    </TouchableOpacity>
                )}
            </View>

            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
                    <Text style={{ color: "#fff" }}>{categorySelected?.name}</Text>
                </TouchableOpacity>
            )}

            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{ color: "#fff" }}>{productSelected?.name}</Text>
                    <Image source={{ uri: `${api.defaults.baseURL}/files/${productSelected?.banner}` }} style={{
                        width: 50,
                        height: 50,
                        resizeMode: 'center', 
                        borderRadius: 8
                    }} />
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={styles.qtdInput}
                    placeholder='1'
                    placeholderTextColor="#f0f0f0"
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>

                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]} onPress={handleFinishOrder}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>

            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 14
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        flexDirection: 'row',
        width: '100%',
        height: 60,
        marginBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    qtdInput: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '60%',
        height: 60,
        marginBottom: 12,
        textAlign: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonAdd: {
        backgroundColor: '#3eb1ff',
        width: '20%',
        height: 60,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 60,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})