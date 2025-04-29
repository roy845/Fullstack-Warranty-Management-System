import axios from "axios";

const IS_PROD: boolean = true;
let BASE_URL: string | undefined = "";

if (IS_PROD) {
  BASE_URL = process.env.EXPO_PUBLIC_API_URL_PROD;
} else {
  BASE_URL = process.env.EXPO_PUBLIC_API_URL_DEV;
}

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
