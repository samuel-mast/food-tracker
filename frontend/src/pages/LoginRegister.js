import { useState } from "react";

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
    return fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

function Login({ setToken }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            const response = await registerUser({ username, password });
            if (response.userId) {
                setToken({ userToken: response.userId });
            }
        } else {
            const response = await loginUser({ username, password });
            if (response.userId) {
                setToken({ userToken: response.userId });
            }
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/90">
                            Username
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent backdrop-blur-sm"
                            placeholder="Enter your username"
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
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-[1.02] shadow-lg"
                    >
                        {isRegister ? "Create Account" : "Sign In"}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-white/60 text-sm">
                        {isRegister
                            ? "Already have an account?"
                            : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-gray-300 hover:text-gray-200 font-medium"
                        >
                            {isRegister ? "Sign in" : "Sign up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
