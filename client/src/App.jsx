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
import InterviewSession from "./dashboard/session/InterviewSession";
import { NetworkStatusProvider } from "./context/NetworkStatusContext";
import { Toaster } from "sonner";
import NetworkStatusHandler from "./helpers/NetworkStatusHandler";
import InputOTPForm from "./authentication/otp-input";
function App() {
	return (
		<NetworkStatusProvider>
			<Toaster position="bottom-right" richColors />
			<NetworkStatusHandler />
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/verify" element={<InputOTPForm />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard/session"
						element={
							<ProtectedRoute>
								<InterviewSession />
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
		</NetworkStatusProvider>
	);
}

export default App;
