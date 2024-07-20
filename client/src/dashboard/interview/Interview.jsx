import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
function Interview({ userId }) {
	const navigate = useNavigate();
	const [sessions, setsessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const handleStartSession = (_id) => {
		navigate(`./session?interviewSessionId=${_id}`);
	};

	useEffect(() => {
		// Fetch sessions from the server
		const fetchsessions = async () => {
			try {
				let config = {
					method: "get",
					maxBodyLength: Infinity,
					url: `${import.meta.env.VITE_BACKEND_URI}/interview?user=${userId}`,
					headers: {},
				};
				const response = await axios.request(config);
				setsessions(response.data);
			} catch (err) {
				if (err.response && err.response.status === 404) {
					setsessions([]); // No scenarios found
				} else {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchsessions();
	}, [userId]);

	if (loading) {
		return (
			<p>
				<ProgressBar></ProgressBar>
			</p>
		);
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div className="flex items-center">
				<h1 className="text-lg font-semibold md:text-2xl">Sessions</h1>
			</div>
			{sessions.length === 0 ? (
				<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">
							You have no Sessions
						</h3>
						<p className="text-sm text-muted-foreground">
							You can start interviewing as soon as you add a Sessions.
						</p>
						<Link to="./create" className="hover:text-gray-500">
							<Button className="mt-4">Add Session</Button>
						</Link>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{sessions.map((session) => (
						<Card key={session._id} className="flex flex-col">
							<CardHeader>
								<CardTitle>{session.status}</CardTitle>
								<CardDescription>{session.inteviewerId}</CardDescription>
							</CardHeader>
							<CardContent></CardContent>
							<CardFooter>
								<Button onClick={() => handleStartSession(session._id)}>
									Start Interview
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</main>
	);
}

export default Interview;
