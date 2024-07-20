import { useState, useEffect } from "react";
import { useWindowSize } from "@react-hook/window-size";

const useNetworkStatus = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [, windowHeight] = useWindowSize();

	useEffect(() => {
		const updateNetworkStatus = () => {
			setIsOnline(navigator.onLine);
		};

		const handleOnline = () => updateNetworkStatus();
		const handleOffline = () => updateNetworkStatus();

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [windowHeight]);

	return isOnline;
};

export default useNetworkStatus;
