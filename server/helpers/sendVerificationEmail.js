const resend = require("../lib/resend");

async function sendVerificationEmail(email, username, verifyCode) {
	try {
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: [email],
			subject: "Hr.Ai Verification Code",
			html: "<p>Here&apos;s your verification code:</p>",
			html: "<p>Hi{username}, your OTP: {verifyCode}</p>",
		});
		return {
			success: true,
			message: "Verification email sent successfully",
		};
	} catch (emailError) {
		console.log("Error sending verification email", emailError);
		return {
			success: false,
			message: "Failed to send verification email",
		};
	}
}

module.exports = sendVerificationEmail;
