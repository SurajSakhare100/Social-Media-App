import React, { useState } from 'react';
import axios from 'axios';
import GoogleLogin from '../components/GoogleLogin';
import { Link, useNavigate } from 'react-router-dom';

function EmailVerificationForm() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(Array(6).fill(''));
    const [validity, setValidity] = useState(Array(6).fill(true));
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!validateEmail(email)) {
            setEmailValid(false);
            return;
        }
        setEmailValid(true);
        setIsSendingCode(true);
        try {
            await axios.post('http://localhost:3000/api/v1/email/send-code', { email });
            setMessage('Verification code sent to your email!');
            setIsCodeSent(true);
        } catch (error) {
            setMessage('Failed to send verification code.');
            console.error('Error sending code:', error.message);
        }
        setIsSendingCode(false);
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/email/verify-code', { email, code: code.join('') });
            setMessage(response.data.message);
            setIsVerified(true);
            setCode(Array(6).fill('')); // Clear the code inputs after successful verification
            const encodedEmail = window.btoa(email);
            if (response.status === 200) {
                // After verification, navigate to the register page with the email as a query parameter
                navigate(`/register?email=${encodedEmail}`);
            }
        } catch (error) {
            setMessage('Failed to verify the code.');
            console.error('Error verifying code:', error.message);
        }
    };

    const handleChangeCode = (index, value) => {
        const newCode = [...code];
        const newValidity = [...validity];

        // Check if the value is a valid number
        if (/^\d?$/.test(value)) {
            newCode[index] = value.slice(-1);
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

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Register to DevNet</h2>
                
                {!isVerified ? (
                    <>
                        <h2 className="text-xl font-medium  mb-2">Email Verification</h2>
                        
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={`w-full p-2 mb-4 border rounded border-gray-300  focus:outline-none focus:ring-2 ${emailValid ? ' ' : 'border-0 py-1.5  bg-gray-100 cursor-not-allowed'
                                }`}
                            disabled={isCodeSent || isVerified}  // Disable input once the code is sent or verified
                        />
                        {!emailValid && emailValid==" " && <p className="text-red-500">Please enter a valid email.</p>}

                        <button
                            onClick={handleSendCode}
                            disabled={!email || isSendingCode || isCodeSent}
                            className={`w-full text-white p-2 rounded transition ${isCodeSent || isSendingCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
                        </button>

                        {isCodeSent && (
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
                                            className={`w-12 p-2 text-center border rounded focus:outline-none focus:ring-2 ${validity[index] ? 'border-gray-300' : 'border-red-500'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleVerifyCode}
                                    className="w-full bg-green-500 text-white p-2 mt-6 rounded hover:bg-green-600 transition"
                                >
                                    Verify Code
                                </button>
                            </>
                        )}

                        <div>
                            <h2 className="text-center text-xl py-3">Or</h2>
                            <GoogleLogin />
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-green-500 mb-4">Code Verified!</h2>
                        <button className="btn bg-green-400">
                            <Link to={`/login`}>Continue to Login</Link>
                        </button>
                    </div>
                )}

                <p className="text-red-500 mt-4 text-center">{message}</p>
                
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationForm;
