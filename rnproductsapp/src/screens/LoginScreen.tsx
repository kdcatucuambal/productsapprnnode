import React from 'react';
import {Platform, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Keyboard} from "react-native";
import Background from "../components/Background";
import WhiteLogo from "../components/WhiteLogo";
import {loginStyle} from "../theme/loginTheme";
import {useForm} from "../hooks/useForm";
import {StackRootScreens} from "../navigator/Navigator";
import {NativeStackScreenProps} from "react-native-screens/native-stack";
import {StackScreenProps} from "@react-navigation/stack";

interface Props extends StackScreenProps<StackRootScreens, "LoginScreen"> {}


const LoginScreen = ({navigation}: Props) => {

    const {email, password, onChange} = useForm({
        email: '',
        password: ''
    });

    const onLogin = ()=>{
        console.log({email, password})
        Keyboard.dismiss();
    }

    return <>
        <Background/>
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={loginStyle.formContainer}>
                <WhiteLogo/>
                <Text style={loginStyle.title}>Login</Text>
                <Text style={loginStyle.label}>User: </Text>
                <TextInput
                    placeholder="Put your user"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    underlineColorAndroid="white"
                    style={[loginStyle.inputField, Platform.OS === "ios" && loginStyle.inputFieldIOS]}
                    selectionColor="white"
                    onChangeText={(value)=>onChange(value, 'email')}
                    value={email}
                    onSubmitEditing={onLogin}
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
                    onSubmitEditing={onLogin}
                    selectionColor="white"
                    secureTextEntry={true}
                />
                <View style={loginStyle.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={loginStyle.button}
                        onPress={onLogin}
                    >
                        <Text style={loginStyle.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={loginStyle.newUserContainer}>
                    <TouchableOpacity activeOpacity={0.8} onPress={()=>{ // @ts-ignore
                        navigation.replace("RegisterScreen")}}>
                        <Text style={loginStyle.buttonText}>
                            New Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    </>;
};

export default LoginScreen;
