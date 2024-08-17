import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function GoogleLogin() {
    const responseGoogle = async (authResult) => {
        try {
            const url = "http://localhost:3000";
            const data = await axios.get(url + `/auth/google/login?code=${authResult.code}`);
            console.log(data);
        } catch (error) {
            console.log('Google Login Error:', error);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => console.log('Google Login Error:', error),
        flow: "auth-code"
    });

    return (
        <div className=''>
            <button className="btn border bg-transparent w-full" onClick={googleLogin}>
                Google Sign in
            </button>
        </div>
    );
}

export default GoogleLogin;
