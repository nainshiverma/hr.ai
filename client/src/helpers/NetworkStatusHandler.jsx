import { useEffect } from "react";
import { toast } from "sonner";
import { useNetworkStatusContext } from "@/context/NetworkStatusContext";

const NetworkStatusHandler = () => {
	const isOnline = useNetworkStatusContext();

	useEffect(() => {
		if (!isOnline) {
			toast.error("No internet connection");
		} else {
			toast.success("Internet connection restored");
			setTimeout(() => {
				// window.location.reload();
			}, 3000); // Adjust the delay as needed
		}
	}, [isOnline]);

	return null;
};

export default NetworkStatusHandler;
