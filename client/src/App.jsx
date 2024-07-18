import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./authentication/log-in";
import Dashboard from "./dashboard/Dashboard";
import Home from "./home/Home";
import Scenario from "./dashboard/scenario/Scenario";
import Interview from "./dashboard/interview/Interview";
import SignUp from "./authentication/sign-up";
import Error from "./components/Error";
import { Setting } from "./dashboard/setting/Setting";
import InterviewSession from "./session/InterviewSession";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/log-in" element={<Login />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route
					path="dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="scenario"
					element={
						<ProtectedRoute>
							<Scenario />
						</ProtectedRoute>
					}
				/>
				<Route
					path="interview"
					element={
						<ProtectedRoute>
							<Interview />
						</ProtectedRoute>
					}
				/>
				<Route
					path="session"
					element={
						<ProtectedRoute>
							<InterviewSession />
						</ProtectedRoute>
					}
				/>
				<Route
					path="setting"
					element={
						<ProtectedRoute>
							<Setting />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Error />} />
			</Routes>
		</Router>
	);
}

export default App;
