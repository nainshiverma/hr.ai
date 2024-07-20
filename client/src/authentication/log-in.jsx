import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toggle } from "../components/ui/toggle";

export default function Login() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = async (data) => {
		//TODO: Make the URL Consistent by adding it to the .env file and referencing it here.
		try {
			const response1 = await axios.post(
				`${import.meta.env.VITE_BACKEND_URI}/auth/login`,
				data
			);

			localStorage.setItem("token", response1.data.token);
			navigate("/dashboard"); // Redirect to a protected route
		} catch (err) {
			setError("Invalid credentials. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
			<div className="mx-auto grid w-[450px] gap-6 bg-white p-6 rounded-lg shadow-md">
				<div className="grid gap-2 text-left">
					<h1 className="text-3xl font-bold">Login</h1>
					<p className="text-balance text-muted-foreground">
						Enter your username below to login to your account
					</p>
				</div>
				<div className="grid gap-4">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								autoComplete="on"
								placeholder="Your Username here"
								{...register("username", {
									required: "Username is required",
								})}
								required
							/>
							{errors.username && <p>{errors.username.message}</p>}
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<Link
									to="/forgot-password"
									className="ml-auto inline-block text-sm text-blue-500 hover:underline"
								>
									Forgot your password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								autoComplete="on"
								{...register("password", {
									required: "Password is required",
								})}
								required
							/>
							{errors.password && <p>{errors.password.message}</p>}
						</div>
						<Toggle
							className="absolute inset-y-0 right-0 px-3 py-1 text-sm
								text-gray-600"
							onChange={togglePasswordVisibility}
							checked={showPassword}
						/>
						<Button type="submit" className="w-full">
							Login
						</Button>
						{/* <SignIn></SignIn> */}
					</form>
					{error && <p>{error}</p>}
				</div>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link to="/sign-up" className="text-blue-500 hover:underline">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}

//!TODO: Fix the Resizing Problem : https://stackoverflow.com/questions/69250282/googles-sign-in-button-resizes-after-loading
//!TODO: Add Password Visibility Toogle
