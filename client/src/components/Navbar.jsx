import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "../authentication/sign-up";
import Login from "../authentication/log-in";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/ui/mode-toggle";
const Navbar = () => {
	return (
		<Router>
			<div className="relative">
				<nav className="bg-opacity-50 backdrop-blur-lg bg-white dark:bg-gray-800 dark:bg-opacity-30 fixed top-0 left-0 right-0 z-10">
					<div className="container mx-auto flex justify-between items-center py-4">
						<div className="text-lg font-bold text-black dark:text-white">
							Intervue
						</div>
						<div className="space-x-4 flex items-center">
							<Link to="/sign-up" className="hover:text-gray-500">
								<Button className="hover:bg-gray-900 bg-black text-white dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
									Sign Up
								</Button>
							</Link>
							<Link to="/log-in" className="hover:text-gray-500">
								<Button className="hover:bg-gray-900 bg-black text-white dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
									Log In
								</Button>
							</Link>
							<ModeToggle />
						</div>
					</div>
				</nav>
				{/* Optional: Add a background image or content */}
			</div>
			<Routes>
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/log-in" element={<Login />} />
				{/* Add your other routes here */}
			</Routes>
		</Router>
	);
};

export default Navbar;
