import "regenerator-runtime";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Send } from "lucide-react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { Toaster, toast } from "sonner"; // Ensure you import the CSS for styling

const Session = () => {
	const [message, setMessage] = useState("");
	const [isStarted, setIsStarted] = useState(false);
	const [hasMicPermission, setHasMicPermission] = useState(false);
	const [question, setQuestion] = useState("");
	const [questionLoaded, setQuestionLoaded] = useState(false);
	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	useEffect(() => {
		fetchNextQuestion();
		checkMicrophonePermission();
	}, []);

	const fetchNextQuestion = async () => {
		try {
			const userId = "6696b8e3505f22ab4f885d03"; // Example userId
			const jobScenarioId = "669743f61b40f7c26b60b773"; // Example jobScenarioId

			// Fetch jobScenario object from your server
			const response = await axios.get(
				`http://localhost:3000/scenario/api?userId=${userId}&jobScenarioId=${jobScenarioId}`
			);
			if (response.status !== 200) {
				throw new Error("Failed to fetch job scenario");
			}
			const jobScenario = response.data;
			// Now fetch the question using jobScenario object

			let data = JSON.stringify(jobScenario);

			let config = {
				method: "get",
				maxBodyLength: Infinity,
				url: "http://localhost:3000/session/nextQuestion",
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			};

			const nextQuestionResponse = await axios.request(config);

			// const nextQuestionResponse = await axios.post(
			// 	"http://localhost:3000/session/nextQuestion",
			// 	data

			if (nextQuestionResponse.status !== 200) {
				throw new Error("Failed to fetch next question");
			}

			setQuestion(nextQuestionResponse.data.question);
			setQuestionLoaded(true);
		} catch (error) {
			console.error("Error fetching next question:", error);
			toast.error("Failed to fetch next question");
		}
	};

	const checkMicrophonePermission = () => {
		navigator.permissions
			.query({ name: "microphone" })
			.then((permissionStatus) => {
				setHasMicPermission(permissionStatus.state === "granted");
				permissionStatus.onchange = () => {
					setHasMicPermission(permissionStatus.state === "granted");
				};
			});
	};

	const handleSubmit = () => {
		if (!isStarted) {
			toast.warning("Please start the answer before sending a message.");
			return;
		}

		const response = message || transcript;

		if (response.length < 10) {
			toast.warning("Response too short.");
			return;
		}

		// Store the answer to local storage
		localStorage.setItem("answer", response);

		// Generate word frequency for the top 10 words
		const wordFrequency = (text) => {
			const words = text.toLowerCase().match(/\b\w+\b/g);
			const frequency = {};

			words.forEach((word) => {
				frequency[word] = (frequency[word] || 0) + 1;
			});

			return Object.entries(frequency)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 10)
				.reduce((acc, [word, count]) => {
					acc[word] = count;
					return acc;
				}, {});

			// let data = JSON.stringify(jobScenario);

			// let config = {
			// 	method: "post",
			// 	maxBodyLength: Infinity,
			// 	url: "http://localhost:3000/session/nextQuestion",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	data: data,
			// };

			// const nextQuestionResponse = await axios.request(config);
		};

		const topWords = wordFrequency(response);
		localStorage.setItem("wordFrequency", JSON.stringify(topWords));

		// Logic to handle sending message
		console.log("Message sent:", response);
		setMessage("");
		resetTranscript();
	};

	const handleMicClick = () => {
		if (!isStarted) {
			toast.warning("Please start the answer before using the microphone.");
			return;
		}
		if (!hasMicPermission) {
			askForMicrophonePermission();
			return;
		}
		if (listening) {
			SpeechRecognition.stopListening();
		} else {
			SpeechRecognition.startListening();
		}
	};

	const askForMicrophonePermission = () => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(() => {
				checkMicrophonePermission();
			})
			.catch((err) => {
				toast.error("Failed to get microphone access.");
				console.error("getUserMedia error:", err);
			});
	};

	const handleStartAnswer = () => {
		setIsStarted(true);
		toast.success("You can now start typing or recording your answer.");
	};

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn&apost support speech recognition.</span>;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-full max-w-lg p-6 space-y-4">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold">Technical Writer</h1>
					<div>
						<Button className="mr-2">Exit Interview</Button>
						<Button>Evaluation Criteria</Button>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<Avatar>
						<AvatarImage src="/avatar.jpg" alt="Interviewer's avatar" />
						<AvatarFallback>TW</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-lg font-medium">Main Question</h2>
						{questionLoaded ? <p>{question}</p> : <p>Loading question...</p>}
					</div>
				</div>
				<div className="space-y-2">
					<Textarea
						className="w-full"
						placeholder="Type your answer..."
						value={message || transcript}
						onChange={(e) => setMessage(e.target.value)}
						disabled={!isStarted}
					/>
					<Button className="w-full" onClick={handleStartAnswer}>
						Start Answer
					</Button>
					<div className="flex items-center space-x-2 justify-end">
						<Button
							onClick={handleMicClick}
							className={listening ? "bg-red-500" : ""}
						>
							<Mic />
						</Button>
						<Button onClick={handleSubmit}>
							<Send />
						</Button>
					</div>
				</div>
			</Card>
			<Toaster />
		</div>
	);
};

export default Session;
