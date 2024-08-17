import React, { useState } from 'react';
import axios from 'axios';

function EmailVerificationForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSendCode = async () => {
        try {
            await axios.post('http://localhost:3000/send-code', { email });
            setMessage('Verification code sent to your email!');
        } catch (error) {
            console.error('Error sending code:', error);
            setMessage('Failed to send verification code.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify-code', { email, code });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error verifying code:', error);
            setMessage('Failed to verify the code.');
        }
    };

    return (
        <div className='w-full h-full mt-24'>
            <div className='w-1/2 '>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className='w-full border focus:'
            />
            <button onClick={handleSendCode} className='btn btn-ghost'>Send Verification Code</button>
            
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                className='w-full border focus:'
            />
            <button onClick={handleVerifyCode} className='btn btn-ghost'>Verify Code</button>
            
            <p>{message}</p>
            </div>
        </div>
    );
}

export default EmailVerificationForm;
