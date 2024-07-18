import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
const Report = () => {
	const [feedbackData, setFeedbackData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeedback = async () => {
			try {
				const response = await axios.get("/api/feedback");
				setFeedbackData(response.data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFeedback();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>Feedback</h1>
			{feedbackData.length === 0 ? (
				<p>No feedback available.</p>
			) : (
				feedbackData.map((feedback, index) => (
					<div key={index} className="feedback-item">
						<h2>Rating: {feedback.rating} ⭐</h2>
						<p>
							<strong>Question:</strong> {feedback.question}
						</p>
						<p>
							<strong>User Answer:</strong> {feedback.answer}
						</p>
						<p>
							<strong>Ideal Answer:</strong> {feedback.idealResponse}
						</p>
						<p>
							<strong>Feedback:</strong> {feedback.feedbackText}
						</p>
						<hr />
					</div>
				))
			)}
		</div>
	);
};

export default Report;
