import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/ui/mode-toggle";
import { ChevronRight, MessageCircleDashed } from "lucide-react"; // Import the desired icon

const Navbar = () => {
	return (
		<div className="relative">
			<nav className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 backdrop-filter backdrop-blur-lg fixed top-0 left-0 right-0 z-10">
				<div className="container mx-auto flex justify-between items-center py-4">
					<div className="flex items-center text-lg font-bold text-black dark:text-white">
						<MessageCircleDashed className="mr-2" /> Intervue.cloud
					</div>
					<div className="space-x-4 flex items-center">
						<Link to="/dashboard" className="hover:text-gray-500">
							<Button
								variant="expandIcon"
								Icon={ChevronRight}
								iconPlacement="right"
								className="hover:bg-gray-900 bg-black text-white dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
							>
								Dashboard
							</Button>
						</Link>
						<ModeToggle />
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
