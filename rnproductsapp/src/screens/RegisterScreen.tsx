import React, {useContext, useEffect} from 'react';
import {Platform, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert} from "react-native";
import WhiteLogo from "../components/WhiteLogo";
import {loginStyle} from "../theme/loginTheme";
import {useForm} from "../hooks/useForm";
import {StackRootScreens} from "../navigator/Navigator";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthContext} from "../context/AuthContext";

interface Props extends StackScreenProps<StackRootScreens, "RegisterScreen"> {}

const RegisterScreen = ({navigation}: Props) => {

    const {signUp, errorMessage, removeError} = useContext(AuthContext);

    const {email, name, password, onChange} = useForm({
        email: '',
        password: '',
        name: ''
    });

    useEffect(()=>{
        if (errorMessage.length === 0) return;

        Alert.alert("Login incorrect", errorMessage, [{text: 'Ok', onPress:()=>{removeError()}}]);
    }, [errorMessage])

    const onRegister = ()=>{
        console.log({email, password, name})
        Keyboard.dismiss();
        signUp({correo: email, nombre: name, password})
    }

    return <>
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#5856D6"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={loginStyle.formContainer}>
                <WhiteLogo/>
                <Text style={loginStyle.title}>Register</Text>
                <Text style={loginStyle.label}>Name: </Text>
                <TextInput
                    placeholder="Put your name"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="default"
                    underlineColorAndroid="white"
                    style={[loginStyle.inputField, Platform.OS === "ios" && loginStyle.inputFieldIOS]}
                    selectionColor="white"
                    onChangeText={(value)=>onChange(value, 'name')}
                    value={name}
                    onSubmitEditing={onRegister}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Text style={loginStyle.label}>Email: </Text>
                <TextInput
                    placeholder="Put your email"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    underlineColorAndroid="white"
                    style={[loginStyle.inputField, Platform.OS === "ios" && loginStyle.inputFieldIOS]}
                    selectionColor="white"
                    onChangeText={(value)=>onChange(value, 'email')}
                    value={email}
                    onSubmitEditing={onRegister}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Text style={loginStyle.label}>Password:</Text>
                <TextInput
                    placeholder="Put your password"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    underlineColorAndroid="white"
                    style={[loginStyle.inputField, Platform.OS === "ios" && loginStyle.inputFieldIOS]}
                    onChangeText={(value)=>onChange(value, 'password')}
                    value={password}
                    onSubmitEditing={onRegister}
                    selectionColor="white"
                    secureTextEntry={true}
                />
                <View style={loginStyle.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={loginStyle.button}
                        onPress={onRegister}
                    >
                        <Text style={loginStyle.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={()=>{ // @ts-ignore
                        navigation.replace("LoginScreen")}}
                        style={loginStyle.buttonReturn}
                    >
                        <Text style={loginStyle.buttonText}>
                            Login
                        </Text>
                    </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    </>;
};

export default RegisterScreen;
