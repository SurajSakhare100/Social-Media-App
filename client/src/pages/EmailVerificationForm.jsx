import React, { useState } from 'react';
import axios from 'axios';
import GoogleLogin from '../components/GoogleLogin';
import { Link } from 'react-router-dom';

function EmailVerificationForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(Array(6).fill(''));
    const [validity, setValidity] = useState(Array(6).fill(true)); // Track validity of each input
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(true);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const handleSendCode = async () => {
        try {
            await axios.post('http://localhost:3000/send-code', { email });
            setMessage('Verification code sent to your email!');
            setIsCodeSent(true)
        } catch (error) {
            console.error('Error sending code:', error.message);
            setMessage('Failed to send verification code.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            setIsCodeSent(true);
            const response = await axios.post('http://localhost:3000/verify-code', { email, code: code.join('') });
            setMessage(response.data.message);
            setIsVerified(true);
        } catch (error) {
            console.error('Error verifying code:', error.message);
            setMessage('Failed to verify the code.');
        }
    };

    const handleChangeCode = (index, value) => {
        const newCode = [...code];
        const newValidity = [...validity];

        // Check if the value is a valid number
        if (/^\d?$/.test(value)) {
            newCode[index] = value.slice(-1); // Allow only one digit per input
            newValidity[index] = true;
            if (index < code.length - 1 && value) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        } else {
            newValidity[index] = false; 
        }

        setCode(newCode);
        setValidity(newValidity);
    };

    const handleKeyDown = (e, index) => {
        const { key } = e;
        if (key === 'Backspace') {
            if (index > 0 && code[index] === '') {
                document.getElementById(`code-input-${index - 1}`).focus();
            }
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                {!isVerified ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-6">Email Verification</h2>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={handleSendCode}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Send Verification Code
                        </button>

                        {isCodeSent &&
                            <>
                                <div className="mt-6 flex justify-between">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-input-${index}`}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleChangeCode(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            maxLength="1"
                                            className={`w-12 p-2 text-center border rounded focus:outline-none focus:ring-2 ${validity[index] ? 'border-gray-300' : 'border-red-500'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleVerifyCode}
                                    className="w-full bg-green-500 text-white p-2 mt-6 rounded hover:bg-green-600 transition"
                                >
                                    Verify Code
                                </button></>

                        }

                        <div>
                            <h2 className='text-center text-xl py-2'>Or</h2>
                            <GoogleLogin/>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-green-500 mb-4">Code Verified!</h2>
                        <button className='btn bg-green-400'>
                            <Link to={`/login`}>Continue to Login</Link>
                        </button>
                    </div>
                )}
                <p className="text-red-500 mt-4 text-center">{message}</p>
            </div>
        </div>
    );
}

export default EmailVerificationForm;
