import React, {createContext, useEffect, useReducer} from "react";
import {LoginData, LoginResponse, Usuario, RegisterData} from "../interfaces/appInterfaces";
import {AuthReducer, AuthState} from "./AuthReducer";
import cafeApi from "../api/cafeApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextProps = {
    errorMessage: string,
    token: string | null,
    user: Usuario | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    signUp: (data: RegisterData) => void,
    signIn: (login: LoginData) => void,
    logOut: () => void,
    removeError: () => void
}

const AuthInitialState: AuthState = {
    token: null,
    status: 'checking',
    user: null,
    errorMessage: '',
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const [state, dispatch] = useReducer(AuthReducer, AuthInitialState);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        checkToken();
    }, [])

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        //No token
        if (!token) return dispatch({type: 'notAuthenticated'});

        //There is token
        const resp = await cafeApi.get<LoginResponse>('/auth');
        if (resp.status !== 200) {
            return dispatch({type: 'notAuthenticated'})
        }

        dispatch({
            type: 'signUp', payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });
    }

    const signUp = async (data: RegisterData) => {
        try {
            const resp = await cafeApi.post<LoginResponse>('/usuarios', data);
            dispatch({
                type: 'signUp', payload: {
                    token: resp.data.token,
                    user: resp.data.usuario
                }
            });
            await AsyncStorage.setItem('token', resp.data.token);

        }catch (error){
            console.log(error.response.data.errors)
            dispatch({
                type: "addError",
                payload: error.response.data.errors[0].msg || 'Email error'
            })
        }

    };
    const signIn = async ({email, password}: LoginData) => {
        try {
            const resp = await cafeApi.post<LoginResponse>('/auth/login', {correo: email, password});
            dispatch({
                type: 'signUp', payload: {
                    token: resp.data.token,
                    user: resp.data.usuario
                }
            });
            await AsyncStorage.setItem('token', resp.data.token);
        } catch (error) {
            console.log(error.response.data.msg)
            dispatch({
                type: "addError",
                payload: error.response.data.msg || 'Data Incorrect'
            })
        }
    };
    const logOut = async () => {
        await AsyncStorage.removeItem("token");
        dispatch({type: "logout"});
    };
    const removeError = () => {
        dispatch({type: "removeError"});
    };

    return (
        <AuthContext.Provider value={{
            ...state, signIn, signUp, logOut, removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}

