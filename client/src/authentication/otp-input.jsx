"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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

	function onSubmit(data) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<TextureCard className="w-full max-w-md">
				<TextureCardHeader>
					<TextureCardTitle>Verify Your Email</TextureCardTitle>
				</TextureCardHeader>
				<TextureCardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
										<FormDescription>
											Please enter the one-time password sent to your email.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<TextureCardFooter>
								<Button type="submit">Submit</Button>
							</TextureCardFooter>
						</form>
					</Form>
				</TextureCardContent>
			</TextureCard>
		</div>
	);
}
