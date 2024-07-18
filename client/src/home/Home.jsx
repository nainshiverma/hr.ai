import "../App.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Navbar />
		</ThemeProvider>
	);
}
