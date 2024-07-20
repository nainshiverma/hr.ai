const BASE_URL = import.meta.env.VITE_BACKEND_URI;

const API_URI = {
	REGISTER_USER: `${BASE_URL}/auth/register`,
	CHECK_USERNAME: (username) => `${BASE_URL}/auth/user/${username}`,
	VERIFY_OTP: `${BASE_URL}/auth/verify`,
};

export default API_URI;
