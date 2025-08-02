import { useState } from "react";

function validateCredentials(credentials) {
    const errors = [];
    const username = credentials.username || '';
    const password = credentials.password || '';

    if (username.length < 3) {
        errors.push("Username must be at least 3 characters long.");
    }
    if (username.length > 20) {
        errors.push("Username must be at most 20 characters long.");
    }
    if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
    }
    if (password.length > 50) {
        errors.push("Password must be at most 50 characters long.");
    }
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push("Username can only contain letters, numbers, and underscores.");
    }
    if (password && !/^[a-zA-Z0-9!@#$%^&*()+=-]+$/.test(password)) {
        errors.push("Password can only contain letters, numbers, and special characters !@#$%^&*()+=-.");
    }
    return errors;
}

async function loginUser(credentials) {
    return fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

async function registerUser(credentials) {
    const errors = validateCredentials(credentials);
    if (errors.length > 0) {
        return { error: errors.join(" ") };
    }
    return fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

function LoginRegister({ setToken }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        
        try {
            if (isRegister) {
                const response = await registerUser({ username, password });
                if (response.userId) {
                    setToken({ userToken: response.userId });
                } else if (response.error) {
                    setErrors([response.error]);
                }
            } else {
                const response = await loginUser({ username, password });
                if (response.userId) {
                    setToken({ userToken: response.userId });
                } else if (response.error) {
                    setErrors([response.error]);
                }
            }
        } catch (error) {
            setErrors([error.message || 'An unexpected error occurred']);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isRegister ? "Create Account" : "Welcome Back"}
                        </h1>
                        <p className="text-white/70">
                            {isRegister
                                ? "Join us and get started"
                                : "Sign in to your account"}
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">
                                Username
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent backdrop-blur-sm"
                                placeholder="Enter your username"
                                maxLength={20}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">
                                Password
                            </label>
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent backdrop-blur-sm"
                                placeholder="Enter your password"
                                maxLength={50}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-[1.02] shadow-lg"
                        >
                            {isRegister ? "Create Account" : "Sign In"}
                        </button>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-white/60 text-sm">
                            {isRegister
                                ? "Already have an account?"
                                : "Don't have an account?"}{" "}
                            <button
                                onClick={() => { setIsRegister(!isRegister); setErrors([]); }}
                                className="text-gray-300 hover:text-gray-200 font-medium"
                            >
                                {isRegister ? "Sign in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                </div>

                {errors.length > 0 && (
                    <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 p-4 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-200 mb-1">
                                    {errors.length === 1 ? 'Error' : 'Errors'}
                                </h3>
                                <ul className="text-sm text-red-300 space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => setErrors([])}
                                className="flex-shrink-0 text-red-400 hover:text-red-300"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginRegister;
