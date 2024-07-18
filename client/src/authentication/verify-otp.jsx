// src/pages/OtpVerificationPage.jsx

import OtpInput from "../components/OtpInput";
import { Button } from "shadcn/ui";
import { useState } from "react";

const OtpVerificationPage = () => {
	const [otp, setOtp] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle OTP verification logic here
		console.log("Entered OTP:", otp);
	};

	return (
		<div className="otp-verification-page">
			<h2>Verify Your Email</h2>
			<form onSubmit={handleSubmit}>
				<OtpInput length={6} onChange={setOtp} />
				<Button type="submit">Verify OTP</Button>
			</form>
		</div>
	);
};

export default OtpVerificationPage;
