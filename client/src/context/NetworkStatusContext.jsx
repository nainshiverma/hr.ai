import { createContext, useContext } from "react";
import useNetworkStatus from "@/hooks/useNetworkStatus";

const NetworkStatusContext = createContext();

export const NetworkStatusProvider = ({ children }) => {
	const isOnline = useNetworkStatus();

	return (
		<NetworkStatusContext.Provider value={isOnline}>
			{children}
		</NetworkStatusContext.Provider>
	);
};

export const useNetworkStatusContext = () => useContext(NetworkStatusContext);
