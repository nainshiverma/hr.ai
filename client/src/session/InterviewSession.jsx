import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import {
	Phone as PhoneIcon,
	Video as VideoIcon,
	Maximize2 as ExpandIcon,
	Mic as MicIcon,
	Send as SendIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import {
	callIssueInteractionProcessing,
	extractInterviewSessionId,
	fetchInterviewSessionData,
	fetchNextQuestion,
} from "@/helpers/api";

const interviewSessionId = extractInterviewSessionId(window.location.href);
const userId = localStorage.getItem("_id");

export default function InterviewSession() {
	const [inputValue, setInputValue] = useState("");
	const [charCount, setCharCount] = useState(0);
	const [messages, setMessages] = useState([]);
	const [questionText, setQuestionText] = useState(""); // State for questionText
	const { transcript, resetTranscript } = useSpeechRecognition();

	useEffect(() => {
		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			toast.error("Your browser does not support speech recognition.");
		}
	}, []);

	useEffect(() => {
		if (userId && interviewSessionId) {
			fetchInterviewSessionData(userId, interviewSessionId)
				.then((data) => {
					if (data) {
						localStorage.setItem("jobScenarioId", data.jobScenarioId);
					} else {
						console.log(
							"Interview session data not found or an error occurred."
						);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	}, []);

	useEffect(() => {
		if (transcript && transcript.length > 0) {
			setInputValue(transcript);
			setCharCount(transcript.length);
		}
	}, [transcript]);

	const handleMicClick = () => {
		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			toast.error("Your browser does not support speech recognition.");
			return;
		}

		SpeechRecognition.startListening({
			continuous: true,
			language: "en-US",
		});
	};

	const handleMicStop = () => {
		SpeechRecognition.stopListening();
		if (transcript) {
			setInputValue(transcript);
			setCharCount(transcript.length);
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		if (value.length <= 500) {
			setInputValue(value);
			setCharCount(value.length);
		}
	};

	const handleSendClick = () => {
		if (inputValue.length < 10) {
			toast.warning("Response too short, please try again.");
		} else {
			// Add user's answer to chat
			addMessage("user", inputValue);
			// Handle sending the message or processing here
			callIssueInteractionProcessing(
				userId,
				interviewSessionId,
				questionText, // Use questionText from state
				inputValue
			);
			setInputValue("");
			setCharCount(0);
			// Fetch next question after user's answer

			fetchNextQuestion(userId, localStorage.getItem("jobScenarioId"))
				.then((nextQuestion) => {
					addMessage("interviewer", nextQuestion.question);
					setQuestionText(nextQuestion.question); // Update questionText state
				})
				.catch((error) => {
					console.error("Error fetching next question:", error);
				});
		}
	};

	const addMessage = (sender, message) => {
		const newMessage = { sender, message };
		setMessages((prevMessages) => [...prevMessages, newMessage]);
	};

	return (
		<div className="flex flex-col h-screen">
			<Toaster position="bottom-right" />
			<header className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center">
					<Avatar>
						<AvatarImage src="/placeholder-user.jpg" />
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<div className="ml-2">
						<h2 className="text-lg font-semibold">Jane Doe</h2>
						<p className="text-sm text-muted-foreground">Active</p>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<PhoneIcon className="w-6 h-6 text-muted-foreground" />
					<VideoIcon className="w-6 h-6 text-muted-foreground" />
					<ExpandIcon className="w-6 h-6 text-muted-foreground" />
				</div>
			</header>
			<main className="flex-1 p-4 overflow-y-auto">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex items-start mb-4 ${
							message.sender === "interviewer" ? "justify-start" : "justify-end"
						}`}
					>
						{message.sender === "interviewer" && (
							<Avatar>
								<AvatarImage src="/placeholder-user.jpg" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
						)}
						<div
							className={`ml-3 p-2 bg-gray-100 rounded-lg ${
								message.sender === "interviewer" ? "" : "mr-3"
							}`}
						>
							<p>{message.message}</p>
						</div>
						{message.sender === "user" && (
							<Avatar>
								<AvatarImage src="/placeholder-user.jpg" />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}
			</main>
			<footer className="flex flex-col p-4 border-t sticky bottom-0 bg-white">
				<div className="flex items-center mb-2">
					<span>{charCount}/500</span>
				</div>
				<div className="flex items-center">
					<Input
						type="text"
						placeholder="Type your response..."
						className="flex-1 mx-4"
						value={inputValue}
						onChange={handleInputChange}
					/>
					<Button variant="ghost" size="icon" onClick={handleMicClick}>
						<MicIcon className={`w-6 h-6 text-muted-foreground`} />
					</Button>
					<Button variant="ghost" size="icon" onClick={handleSendClick}>
						<SendIcon className="w-6 h-6 text-muted-foreground" />
					</Button>
				</div>
			</footer>
		</div>
	);
}
