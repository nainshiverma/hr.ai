import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { checkUsernameAvailability } from "@/helpers/api";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CircleX } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { CircleAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const schema = z.object({
	username: z
		.string()
		.min(4, { message: "At least 3 characters long" })
		.regex(/^[a-zA-Z0-9-]+$/, {
			message: "Only letters, numbers, and hyphens allowed",
		}),
});

export default function SignUp() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(schema),
		mode: "onChange",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isUsernameUnique, setIsUsernameUnique] = useState(null);
	// const username = watch("username");

	const [username, email, firstName, lastName, password] = watch([
		"username",
		"email",
		"firstName",
		"lastName",
		"password",
	]);
	const debouncedUsername = useDebounce(username, 500); // Adjust delay as needed
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	useEffect(() => {
		const validateUsername = async (debouncedUsername) => {
			const { success, error } = schema.safeParse({
				username: debouncedUsername,
			});
			if (success) {
				try {
					setLoading(true);
					const isUnique = await checkUsernameAvailability(debouncedUsername);
					setIsUsernameUnique(isUnique);
				} catch (err) {
					toast.error("Error checking username uniqueness.");
				} finally {
					setLoading(false);
				}
			} else {
				setIsUsernameUnique(false);
			}
		};
		validateUsername(debouncedUsername);
	}, [debouncedUsername]);

	const onSubmit = async () => {
		setLoading(true);
		let data = JSON.stringify({
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			password: password,
		});
		try {
			let config = {
				method: "post",
				maxBodyLength: Infinity,
				url: "http://localhost:3000/auth/register",
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			};
			axios
				.request(config)
				.then((response) => {
					console.log(JSON.stringify(response.data));
					toast.success("Account created successfully!");
					navigate("/verify");
				})
				.catch((error) => {
					toast.error("Something went Wrong");
					console.log(error);
				});
		} catch (err) {
			console.log(err);
			toast.error("Error creating account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
			<Toaster position="top-center" richColors />
			<div className="grid gap-2 text-left">
				<Card className="mx-auto max-w-sm">
					<CardHeader>
						<CardTitle className="text-xl">Sign Up</CardTitle>
						<CardDescription>
							Enter your information to create an account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="username">Username</Label>
									<div className="flex items-center">
										<Controller
											name="username"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													id="username"
													placeholder="Your Username here"
													{...field}
													className={`${
														errors.username
															? "ring-2 ring-red-500"
															: isUsernameUnique === false
															? "ring-2 ring-yellow-500"
															: isUsernameUnique === true
															? "ring-2 ring-green-500"
															: ""
													}`}
												/>
											)}
										/>
										{errors.username ? (
											<span className="text ml-2">
												<CircleAlert className="h-4 w-4" />
											</span>
										) : isUsernameUnique === true ? (
											<span className="text ml-2">
												<CircleCheck className="h-4 w-4" />
											</span>
										) : isUsernameUnique === false ? (
											<span className="text ml-2">
												<CircleX className="h-4 w-4" />
											</span>
										) : null}
									</div>
									<div className="h-4">
										{errors.username && (
											<p className="flex items-center text-red-500 font-mono text-xs leading-tigh">
												<span className="mr-1">
													<CircleAlert className="h-3 w-3" />
												</span>
												{errors.username.message}
											</p>
										)}
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="firstName">First Name</Label>
										<Controller
											name="firstName"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													id="firstName"
													placeholder="Max"
													{...field}
													required
												/>
											)}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Controller
											name="lastName"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													id="lastName"
													placeholder="Robinson"
													{...field}
													required
												/>
											)}
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Controller
										name="email"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												id="email"
												type="email"
												placeholder="m@example.com"
												{...field}
												required
											/>
										)}
									/>
									{errors.email && <p>{errors.email.message}</p>}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<div className="flex items-center">
										<Controller
											name="password"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													id="password"
													type={showPassword ? "text" : "password"}
													{...field}
													required
												/>
											)}
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											className="ml-2"
										>
											{showPassword ? (
												<EyeOffIcon className="h-4 w-4" />
											) : (
												<EyeIcon className="h-4 w-4" />
											)}
										</button>
									</div>
									{errors.password && <p>{errors.password.message}</p>}
								</div>
								{/* <Button
									// variant="expandIcon"
									// Icon={ArrowUpRight}
									type="submit"
									className="w-full"
									// iconPlacement="right"
									disabled={loading}
								>
									{loading ? "Creating account..." : "Create an account"}
								</Button> */}
								<Button
									loading={loading}
									variant="shine"
									type="submit"
									className="w-full"
								>
									Create account
								</Button>
								<Button variant="outline" className="w-full">
									Sign up with Google
								</Button>
							</div>
						</form>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link to="/log-in" className="underline">
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
