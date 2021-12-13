import axios, {AxiosRequestConfig} from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://prodsrnativeapi.herokuapp.com/api';

const cafeApi = axios.create({baseURL});

cafeApi.interceptors.request.use(
    async (config: AxiosRequestConfig)=>{
        const token = await AsyncStorage.getItem('token');
        if (token){
            // @ts-ignore
            config.headers['x-token']=token;
        }
        return config;
    }
);

export default cafeApi;



