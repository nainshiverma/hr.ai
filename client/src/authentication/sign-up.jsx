import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
	TextureCard,
	TextureCardHeader,
	TextureCardTitle,
	TextureCardContent,
	TextureCardDescription,
	TextureSeparator,
} from "../components/ui/texture-card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { isUniqueUsername, registerUser } from "@/helpers/authAPI";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CircleX, CircleCheck, CircleAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { LoadingButton } from "@/components/ui/loading-button";
const schema = z.object({
	username: z
		.string()
		.min(4, { message: "Between 3 to 8 characters" })
		.max(8, { message: "Between 3 to 8 characters" })
		.regex(/^[a-zA-Z0-9-]+$/, {
			message: "Letters, numbers and hyphens allowed",
		}),
});

export default function SignUp() {
	const navigate = useNavigate();
	const {
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
			const { success } = schema.safeParse({
				username: debouncedUsername,
			});
			if (success) {
				try {
					setLoading(true);
					const isUnique = await isUniqueUsername(debouncedUsername);
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
		const userData = {
			firstName,
			lastName,
			username,
			email,
			password,
		};

		try {
			await registerUser(userData);
			toast.success(`Account Registerd Successfully`);
			navigate("/verify");
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
			<div className="min-h-screen flex items-center justify-center">
				<Toaster position="top-center" richColors />
				<div className="grid gap-2 text-left">
					<TextureCard className="mx-auto max-w-sm">
						<TextureCardHeader>
							<TextureCardTitle className="text-xl pl-6">
								Sign Up
							</TextureCardTitle>
							<TextureCardDescription className="pl-6 pb-4">
								Enter your information to create an account
							</TextureCardDescription>
							<TextureSeparator />
						</TextureCardHeader>

						<TextureCardContent>
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
														placeholder="Your username here"
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
													<CircleAlert className="h-4 w-4 text-yellow-500" />
												</span>
											) : isUsernameUnique === true ? (
												<span className="text ml-2">
													<CircleCheck className="h-4 w-4 text-green-500" />
												</span>
											) : isUsernameUnique === false ? (
												<span className="text ml-2">
													<CircleX className="h-4 w-4 text-red-500" />
												</span>
											) : loading ? (
												<Spinner size="small" />
											) : null}
										</div>
										<div className="h-4">
											{errors.username && (
												<p className="flex items-center text-red-500 font-mono text-xs leading-tight">
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
														placeholder="Rohit"
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
														placeholder="Kumar"
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
													placeholder="email@domain.com"
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
													<EyeOffIcon className="h-4 w-4 transition-opacity duration-300 opacity-100" />
												) : (
													<EyeIcon className="h-4 w-4 transition-opacity duration-300 opacity-100" />
												)}
											</button>
										</div>
										{errors.password && <p>{errors.password.message}</p>}
									</div>
									{loading ? (
										<LoadingButton loading></LoadingButton>
									) : (
										<Button variant="shine" type="submit" className="w-full">
											Create account
										</Button>
									)}

									<Button variant="outline" className="w-full">
										Sign up with Google
									</Button>
								</div>
							</form>
							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link to="/log-in" className="text-blue-500 hover:underline">
									Sign in
								</Link>
							</div>
						</TextureCardContent>
					</TextureCard>
				</div>
			</div>
		</div>
	);
}
