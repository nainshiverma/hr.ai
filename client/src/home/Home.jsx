"use client";
import "../App.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Hero from "./Hero";
import IconSection from "./Features";
export default function Home() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
			<Navbar />
			<Hero />
			<IconSection />
		</ThemeProvider>
	);
}
