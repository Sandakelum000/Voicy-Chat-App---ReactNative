import { useState } from "react";
import { UserRegistrationData } from "../components/userContext";

const API = process.env.EXPO_PUBLIC_APP_URL + "/VoicyApp";

export const createNewAccount = async (userRegistrationData: UserRegistrationData) => {
    let formData = new FormData();
    formData.append("firstName", userRegistrationData.firstName);
    formData.append("lastName", userRegistrationData.lastName);
    formData.append("countryCode", userRegistrationData.countryCode);
    formData.append("contactNo", userRegistrationData.contactNo);
    formData.append("password", userRegistrationData.password);
    formData.append("profileImage", {
        uri: userRegistrationData.profileImage,
        name: "profile.png",
        type: "image/png",
    } as any);

    const response = await fetch(API + "/UserController", {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        return "OOPS! Account creation faild";
    }
};

export const uploadProfileImage = async (userId: string, imageUri: string) => {

    let formData = new FormData();
    formData.append("userId", userId);
    formData.append("profileImage", {
        uri: imageUri,
        type: "image/png",
        name: "profile.png"
    } as any);

    const response = await fetch(API + "/ProfileController", {
        method: "POST",
        body: formData
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.warn("Profile Image uploading failed!");
    }
};


export const userSignIn = async (countryCode: string, mobileNo: string, password: string) => {

    let formData = new FormData();
    formData.append("countryCode",countryCode);
    formData.append("mobileNo",mobileNo);
    formData.append("password",password);
    
    const response = await fetch(API + "/UserSignIn", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        return "OOPS! Account creation faild";
    }
}

