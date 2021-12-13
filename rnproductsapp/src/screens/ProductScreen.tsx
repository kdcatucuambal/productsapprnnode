import React, {useEffect, useState, useContext} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {StackScreenProps} from "@react-navigation/stack";
import {ProductsStackParams} from "../navigator/ProductsNavigator";
import LoadingScreen from "./LoadingScreen";
import {Picker} from '@react-native-picker/picker';
import useCategories from "../hooks/useCategories";
import {useForm} from "../hooks/useForm";
import {ProductsContext} from "../context/ProductsContext";

interface Props extends StackScreenProps<ProductsStackParams, "ProductScreen"> {
}

const ProductScreen = ({route, navigation}: Props) => {

    const [isLoading, setIsLoading] = useState(true);


    const {categories, isLoading: isLoadCategories} = useCategories();

    const {
        loadProductById,
        addProduct,
        updateProduct,
        uploadImage
    } = useContext(ProductsContext);

    const {id = '', name = ''} = route.params;

    const [tempUri, setTempUri] = useState<string>();

    const {_id, categoriaId, nombre, img, form, onChange, setFormValue} = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    });

    useEffect(() => {
        navigation.setOptions({
            title: nombre ? nombre : "Product Name",
            headerTitleAlign: "center"
        });
        console.log("Effect 1")
    }, [nombre])

    useEffect(() => {
        loadProduct();
        console.log("Effect 2")
    }, []);

    useEffect(() => {
        if (id === '' && name === '') {
            setIsLoading(false);
            return;
        }
    }, []);

    const loadProduct = async () => {
        if (id.length === 0) return;
        const p = await loadProductById(id);
        setFormValue({
            _id: p._id,
            img: p.img || '',
            nombre: p.nombre,
            categoriaId: p.categoria._id
        });
        setIsLoading(false);
    }

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            await updateProduct(categoriaId, nombre, id);
        } else {
            const tempCategoriaID = categoriaId || categories[0]._id;
            const productCreated = await addProduct(categoriaId, nombre);
            onChange(productCreated._id, "_id");
        }
    }


    const takePhoto = () => {
        launchCamera({
            mediaType: "photo",
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return;
            if (resp.assets) {
                if (!resp.assets[0].uri) return;
                setTempUri(resp.assets[0].uri);
                uploadImage(resp, _id);
            }
        });
    }

    const takePhotoFromGallery = ()=>{
        launchImageLibrary({
            mediaType: "photo",
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return;
            if (resp.assets) {
                if (!resp.assets[0].uri) return;
                setTempUri(resp.assets[0].uri);
                uploadImage(resp, _id);
            }
        });
    }

    if (isLoading) {
        return (<LoadingScreen/>)
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Product name: </Text>
                <TextInput
                    placeholder="Product"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />
                <Text style={styles.label}>Category: </Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(itemValue, itemIndex) =>
                        onChange(itemValue, 'categoriaId')
                    }>
                    {
                        categories.map(c => (
                            <Picker.Item
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>
                <Button
                    title="Save"
                    onPress={saveOrUpdate}
                    color="#5856D6"/>

                {
                    (_id.length > 0) && (

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 10
                        }}>
                            <Button title="Camera" onPress={takePhoto} color="#5856D6"/>
                            <View style={{width: 10}}/>
                            <Button title="Gallery" onPress={takePhotoFromGallery} color="#5856D6"/>
                        </View>
                    )
                }

                {
                    (img.length > 0 && !tempUri) && (<Image
                        source={{uri: img}}
                        style={{
                            width: '100%',
                            height: 300
                        }}
                    />)
                }
                {
                    (tempUri) && (<Image
                        source={{uri: tempUri}}
                        style={{
                            width: '100%',
                            height: 300
                        }}
                    />)
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginVertical: 5,
        marginBottom: 15
    }
});

export default ProductScreen;
