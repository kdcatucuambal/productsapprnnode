import React, {createContext, useEffect, useState} from "react";
import {Producto, ProductsResponse} from "../interfaces/appInterfaces";
import cafeApi from "../api/cafeApi";
import {ProductsStackParams} from "../navigator/ProductsNavigator";
import {ImagePickerResponse} from "react-native-image-picker";


type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; //TODO: Change any
}

export const ProductsContext = createContext({} as ProductsContextProps);



export const ProductsProvider = ({children}: any) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts().then();
    }, []);

    const loadProducts = async () => {
        const response = await cafeApi.get<ProductsResponse>('productos?limite=50');
        //setProducts([...products, ...response.data.productos])
        setProducts([...response.data.productos])
    }

    const addProduct = async (categoryId: string, productName: string) => {
        const response = await cafeApi.post<Producto>('/productos',
            {nombre: productName, categoria: categoryId});
        setProducts([...products, response.data]);
        return response.data;
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
     const response = await cafeApi.put<Producto>(`productos/${productId}`, {
         nombre: productName, categoria: categoryId
     });
     setProducts(products.map(p=>{
         if (p._id === response.data._id){
             return response.data;
         }
         return p;
     }));
    }

    const deleteProduct = async (id: string) => {
    };

    const loadProductById = async (id: string): Promise<Producto> => {
        const response = await cafeApi.get<Producto>(`productos/${id}`);
        return response.data;
    };

    const uploadImage = async (data: ImagePickerResponse, id: string) => {
        const file = data.assets![0];
        const fileToUpload = {
            uri: file.uri,
            type: file.type,
            name: file.fileName
        }

        const form = new FormData();
        form.append("achivo", fileToUpload);
        try {
            const resp = await cafeApi.put(`uploads/productos/${id}`, form);
            console.log(resp);
        }catch (error){
            console.log(error)
        }

    };

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
