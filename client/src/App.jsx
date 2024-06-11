import "./App.css";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div>
				<Button>Ai Mock Interview</Button>
				<ModeToggle></ModeToggle>s
			</div>
		</ThemeProvider>
	);
}

export default App;
