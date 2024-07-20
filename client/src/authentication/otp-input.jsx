"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	TextureCard,
	TextureCardHeader,
	TextureCardContent,
	TextureCardFooter,
	TextureCardTitle,
} from "@/components/ui/texture-card";
import { verifyOTP } from "@/helpers/authAPI";

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
});

export default function InputOTPForm() {
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	async function onSubmit(data) {
		setLoading(true);
		try {
			const response = await verifyOTP(data.pin);
			// if (response.response.status != 200) {
			// 	toast.error(response.message);
			// }
			toast.success("Email Verified Successfully");
			navigate("/dashboard");
		} catch (error) {
			console.log(error);
			// toast.error();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
			<div className="min-h-screen flex items-center justify-center">
				<Toaster position="top-center" richColors />
				<div className="grid gap-2 text-left">
					<TextureCard className="mx-auto max-w-sm">
						<TextureCardHeader>
							<TextureCardTitle clasname="text-xl pl-6">
								Verify Your Email
							</TextureCardTitle>
						</TextureCardHeader>
						<TextureCardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<div className="grid gap-4">
										<div className="grid gap-2"></div>
										<FormField
											control={form.control}
											name="pin"
											render={({ field }) => (
												<FormItem>
													<FormLabel>One-Time Password</FormLabel>
													<FormControl>
														<InputOTP maxLength={6} {...field}>
															<InputOTPGroup>
																<InputOTPSlot index={0} />
																<InputOTPSlot index={1} />
																<InputOTPSlot index={2} />
																<InputOTPSlot index={3} />
																<InputOTPSlot index={4} />
																<InputOTPSlot index={5} />
															</InputOTPGroup>
														</InputOTP>
													</FormControl>
													<FormDescription clasname="text-sm">
														Please enter the one-time password sent to your
														email.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<TextureCardFooter>
											{loading ? (
												<LoadingButton loading></LoadingButton>
											) : (
												<Button
													variant="shine"
													type="submit"
													className="w-full"
												>
													Verify
												</Button>
											)}
										</TextureCardFooter>
									</div>
								</form>
							</Form>
						</TextureCardContent>
					</TextureCard>
				</div>
			</div>
		</div>
	);
}
