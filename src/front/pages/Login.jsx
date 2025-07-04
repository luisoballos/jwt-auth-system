import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleClickLogin = async () => {
		const resp = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, resp);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.msg || "Login failed");
			}

			const data = await response.json();
			console.log("Login successful:", data);

			// Store the token in localStorage
			localStorage.setItem("jwt-token", data.access_token);

			// Redirect to Private page
			navigate("/private");

		} catch (error) {
			console.error("There was an error during login:", error);
		}
	};

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Login</h1>
			<div>
				<input
					type="email"
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleClickLogin}>Login</button>
			</div>
		</div>
	);
};