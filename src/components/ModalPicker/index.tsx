import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps {
    options: CategoryProps[] ;
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps) => void;
}

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window')

export default function ModalPicker({handleCloseModal, options, selectedItem}:ModalPickerProps) {

    function OnPressItem(item: CategoryProps) {
        // console.log(item)
        selectedItem(item);
        handleCloseModal();
    }

    const option =  options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => OnPressItem(item)}>
            <Text style={styles.item}>
                {item?.name}
            </Text>
        </TouchableOpacity>
    ))

    return (
        <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content:{
        width: WIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: '#1d1d2e',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4,
    },
    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#fff'
    },
    item: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    }
})