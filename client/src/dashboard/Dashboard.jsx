import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Bell,
	CircleUser,
	Home,
	LineChart,
	Menu,
	Package,
	Package2,
	Search,
	ShoppingCart,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Scenario from "./scenario/Scenario";
import Interview from "./interview/Interview";
import { ProgressBar } from "@/components/ProgressBar";
import { getUserId } from "@/helpers/api";
import { Charts } from "./Charts";
import InterviewSession from "./session/InterviewSession";

function Dashboard() {
	const [selectedComponent, setSelectedComponent] = useState("Dashboard");
	const [isLoading, setIsLoading] = useState(false);
	getUserId(localStorage.getItem("token"));
	const userId = localStorage.getItem("_id");
	useEffect(() => {
		// Simulate loading state
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [selectedComponent]);

	const renderComponent = () => {
		if (isLoading) {
			return (
				<div className="flex justify-center items-center h-full">
					<ProgressBar></ProgressBar>
				</div>
			);
		}

		switch (selectedComponent) {
			case "Dashboard":
				return <Charts></Charts>;
			case "Scenario":
				return (
					<div>
						<Scenario userId={userId}></Scenario>
					</div>
				);
			case "Session":
				return (
					<div>
						<Interview userId={userId}></Interview>
					</div>
				);
			case "Report":
				return (
					<div>
						<InterviewSession></InterviewSession>
					</div>
				);
			case "Asset":
				return <div></div>;
			default:
				return <div>Dashboard Content</div>;
		}
	};

	return (
		// <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
						<Link href="/" className="flex items-center gap-2 font-semibold">
							<Package2 className="h-6 w-6" />
							<span className="">Intervue</span>
						</Link>
						<Button variant="outline" size="icon" className="ml-auto h-8 w-8">
							<Bell className="h-4 w-4" />
							<span className="sr-only">Toggle notifications</span>
						</Button>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<button
								onClick={() => setSelectedComponent("Dashboard")}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
									selectedComponent === "Dashboard"
										? "bg-primary text-muted"
										: "bg-muted text-primary hover:text-primary"
								}`}
							>
								<Home className="h-4 w-4" />
								Dashboard
							</button>
							<button
								onClick={() => setSelectedComponent("Scenario")}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
									selectedComponent === "Scenario"
										? "bg-primary text-muted"
										: "bg-muted text-primary hover:text-primary"
								}`}
							>
								<ShoppingCart className="h-4 w-4" />
								Scenario
							</button>
							<button
								onClick={() => setSelectedComponent("Interview")}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
									selectedComponent === "Interview"
										? "bg-primary text-muted"
										: "bg-muted text-primary hover:text-primary"
								}`}
							>
								<Package className="h-4 w-4" />
								Interview
							</button>
							<button
								onClick={() => setSelectedComponent("Session")}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
									selectedComponent === "Session"
										? "bg-primary text-muted"
										: "bg-muted text-primary hover:text-primary"
								}`}
							>
								<Users className="h-4 w-4" />
								Session
							</button>
							<button
								onClick={() => setSelectedComponent("Report")}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
									selectedComponent === "Report"
										? "bg-primary text-muted"
										: "bg-muted text-primary hover:text-primary"
								}`}
							>
								<LineChart className="h-4 w-4" />
								Report
							</button>
						</nav>
					</div>

					<div className="mt-auto p-4">
						<Card x-chunk="dashboard-02-chunk-0">
							<CardHeader className="p-2 pt-0 md:p-4">
								<CardTitle>Upgrade to Pro</CardTitle>
								<CardDescription>
									Unlock all features and get unlimited access to our support
									team.
								</CardDescription>
							</CardHeader>
							<CardContent className="p-2 pt-0 md:p-4 md:pt-0">
								<Button size="sm" className="w-full">
									Upgrade
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<Link
									href="#"
									className="flex items-center gap-2 text-lg font-semibold"
								>
									<Package2 className="h-6 w-6" />
									<span className="sr-only">Intervue</span>
								</Link>
								<button
									onClick={() => setSelectedComponent("Dashboard")}
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Home className="h-5 w-5" />
									Dashboard
								</button>
								<button
									onClick={() => setSelectedComponent("Scenario")}
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
								>
									<Package className="h-5 w-5" />
									Scenario
								</button>
								<button
									onClick={() => setSelectedComponent("Session")}
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Users className="h-5 w-5" />
									Session
								</button>
								<button
									onClick={() => setSelectedComponent("Report")}
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<LineChart className="h-5 w-5" />
									Report
								</button>
								<button
									onClick={() => setSelectedComponent("Asset")}
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<LineChart className="h-5 w-5" />
									Assets
								</button>
							</nav>
							<div className="mt-auto">
								<Card>
									<CardHeader>
										<CardTitle>Upgrade to Pro</CardTitle>
										<CardDescription>
											Unlock all features and get unlimited access to our
											support team.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button size="sm" className="w-full">
											Upgrade
										</Button>
									</CardContent>
								</Card>
							</div>
						</SheetContent>
					</Sheet>
					<div className="w-full flex-1">
						<form>
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search Intervue..."
									className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
								/>
							</div>
						</form>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="icon" className="rounded-full">
								<CircleUser className="h-5 w-5" />
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>

				{renderComponent()}
			</div>
		</div>
		// </div>
	);
}

export default Dashboard;
