import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl} from "react-native";
import {ProductsContext} from "../context/ProductsContext";
import {StackScreenProps} from "@react-navigation/stack";
import {ProductsStackParams} from "../navigator/ProductsNavigator";

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {
}


const ProductsScreen = ({navigation}: Props) => {

    const {products, loadProducts} = useContext(ProductsContext);
    const [isRefresing, setIsRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{marginRight: 20}}
                    onPress={() => navigation.navigate({name: "ProductScreen", params: {}})}
                >
                    <Text>New</Text>
                </TouchableOpacity>
            )
        })
    }, []);

    const loadProductsFromBackend = async()=>{
        setIsRefreshing(true);
        await loadProducts();
        setIsRefreshing(false);
    }

    return (
        <View style={{
            flex: 1,
            marginHorizontal: 10
        }}>
            <FlatList data={products} keyExtractor={(p) => p._id}
                      renderItem={
                          ({item}) => (
                              <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => navigation.navigate({
                                      name: "ProductScreen",
                                      params: {id: item._id, name: item.nombre}
                                  })}>
                                  <Text
                                      style={styles.productName}>
                                      {item.nombre} {item.precio}
                                  </Text>
                              </TouchableOpacity>
                          )}
                      ItemSeparatorComponent={() => (<View style={styles.itemsSeparator}/>)}
                      refreshControl={
                          <RefreshControl
                              refreshing={isRefresing}
                              onRefresh={loadProductsFromBackend}
                          />
                      }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productName: {
        fontSize: 20
    },
    itemsSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: "rgba(0,0,0,0.1)"
    }
});

export default ProductsScreen;
