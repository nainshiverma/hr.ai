// import jwt from "jsonwebtoken";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import * as z from "zod";

// const newJobScenarioSchema = z.object({
// 	user: z
// 		.string()
// 		.min(1, "User is required")
// 		.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid User ID"),
// 	jobTitle: z.string().min(1, "Job Title is required"),
// 	jobDescription: z.string().min(1, "Job Description is required"),
// 	experience: z
// 		.number()
// 		.nonnegative("Experience in years must be a non-negative number"),
// 	company: z.string().min(1, "Company is required"),
// 	createdAt: z.date().optional(),
// 	updatedAt: z.date().optional(),
// });

function CreateScenarioForm() {
	const [title, setTitle] = useState("");
	const [company, setCompany] = useState("");
	const [description, setDescription] = useState("");
	const [experience, setExperience] = useState("");
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		// const payload = jwt.verify(jwt, "your-secret-key");
		const userId = "6696b8e3505f22ab4f885d03";

		const data = {
			user: userId,
			jobTitle: title,
			jobDescription: description,
			experience: parseInt(experience, 10),
			company: company,
		};

		try {
			// newJobScenarioSchema.parse(data); // Validate data with Zod schema
			setErrors({}); // Clear errors if validation passes
			await axios.post("http://localhost:3000/scenario", data);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors = error.errors.reduce((acc, curr) => {
					acc[curr.path[0]] = curr.message;
					return acc;
				}, {});
				setErrors(fieldErrors);
			} else {
				console.error("Error saving scenario:", error);
			}
		}
	};

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" className="h-7 w-7">
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Back</span>
					</Button>
					<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
						Pro Controller
					</h1>
					<Badge variant="outline" className="ml-auto sm:ml-0">
						In stock
					</Badge>
				</div>
				<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
					<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
						<Card x-chunk="dashboard-07-chunk-0">
							<CardHeader>
								<CardTitle>Scenario Details</CardTitle>
								<CardDescription>
									Lipsum dolor sit amet, consectetur adipiscing elit
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="grid gap-6">
									<div className="grid gap-3">
										<Label htmlFor="title">Job Title</Label>
										<Input
											id="title"
											placeholder="Machine Learning Senior Engineer"
											type="text"
											className="w-full"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
										/>
										{errors.jobTitle && (
											<span className="text-red-500">{errors.jobTitle}</span>
										)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="company">Institution</Label>
										<Input
											id="company"
											placeholder="Amazon"
											type="text"
											className="w-full"
											value={company}
											onChange={(e) => setCompany(e.target.value)}
										/>
										{errors.company && (
											<span className="text-red-500">{errors.company}</span>
										)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="description">Job Description</Label>
										<Textarea
											id="description"
											placeholder="Paste Job Description here"
											className="min-h-32"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
										/>
										{errors.jobDescription && (
											<span className="text-red-500">
												{errors.jobDescription}
											</span>
										)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="experience">Experience</Label>
										<Input
											type="number"
											id="experience"
											value={experience}
											onChange={(e) => setExperience(e.target.value)}
										/>
										{errors.experience && (
											<span className="text-red-500">{errors.experience}</span>
										)}
									</div>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm" type="reset">
											Discard
										</Button>
										<Button size="sm" type="submit">
											Save Scenario
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</main>
	);
}

export default CreateScenarioForm;
