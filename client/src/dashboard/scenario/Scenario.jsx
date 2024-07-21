import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import {
	listScenarios,
	createScenario,
	updateScenario,
} from "@/helpers/scenarioAPI";

function Scenario({ userId }) {
	const [title, setTitle] = useState("");
	const [company, setCompany] = useState("");
	const [description, setDescription] = useState("");
	const [experience, setExperience] = useState("");
	const [errors, setErrors] = useState({});
	const [editingScenario, setEditingScenario] = useState(null);

	const handleSave = async (e) => {
		e.preventDefault();

		const data = {
			userId: userId,
			jobTitle: title,
			jobDescription: description,
			experience: parseInt(experience, 10),
			company: company,
		};

		try {
			if (editingScenario) {
				await updateScenario(editingScenario._id, data);
				setEditingScenario(null);
			} else {
				await createScenario(data);
			}
			const response = await listScenarios(userId);
			setScenarios(response);
			handleClose();
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

	// const handleDelete = async (id) => {
	// 	try {
	// 		await deleteScenario(id);
	// 		const response = await listScenarios(userId);
	// 		setScenarios(response);
	// 	} catch (error) {
	// 		console.error("Error deleting scenario:", error);
	// 	}
	// };

	const handleEdit = useCallback(() => {
		// setEditingScenario(scenario);
		// setTitle(scenario.jobTitle);
		// setCompany(scenario.company);
		// setDescription(scenario.jobDescription);
		// setExperience(scenario.experience.toString());
		// handleOpen();
	}, []);

	const [scenarios, setScenarios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const handleOpen = () => setIsOpen(true);
	const handleClose = () => {
		setIsOpen(false);
		setEditingScenario(null);
		setTitle("");
		setCompany("");
		setDescription("");
		setExperience("");
		setErrors({});
	};

	useEffect(() => {
		const fetchScenarios = async () => {
			setLoading(true);
			try {
				const response = await listScenarios(userId);
				setScenarios(response);
			} catch (err) {
				if (err.response && err.response.status === 404) {
					setScenarios([]);
				} else {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchScenarios();
	}, [userId]);

	if (loading) {
		return <ProgressBar />;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<div className="flex items-center">
				<h1 className="text-lg font-semibold md:text-2xl">Scenario</h1>
			</div>
			{scenarios.length === 0 ? (
				<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">
							You have no Scenarios
						</h3>
						<p className="text-sm text-muted-foreground">
							You can start scheduling sessions as soon as you add a Scenario.
						</p>
						<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger asChild>
								<Button
									className="mt-4"
									variant="outline"
									onClick={() => handleOpen}
								>
									Add Scenario
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>
										{editingScenario ? "Edit Scenario" : "Add Scenario"}
									</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSave} className="grid gap-6">
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
								</form>
								<DialogFooter>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											type="reset"
											onClick={handleClose}
										>
											Discard
										</Button>
										<Button size="sm" type="submit" onClick={handleSave}>
											Save Scenario
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{scenarios.map((scenario) => (
						<Card key={scenario._id} className="flex flex-col">
							<CardHeader>
								<CardTitle>{scenario.jobTitle}</CardTitle>
								<CardDescription>{scenario.company}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{scenario.jobDescription}</p>
								<p>Experience: {scenario.experience} years</p>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									variant="outline"
									size="sm"
									onClick={handleEdit(scenario)}
								>
									Edit
								</Button>
								<Button variant="destructive" size="sm">
									Delete
								</Button>
							</CardFooter>
						</Card>
					))}
					<Card
						className="flex flex-col justify-center items-center cursor-pointer"
						onClick={handleOpen}
					>
						<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger asChild>
								<Button
									className="mt-4 border-0 border-dashed"
									variant="ghost"
									border-0
									onClick={() => handleOpen}
								>
									+
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>
										{editingScenario ? "Edit Scenario" : "Add Scenario"}
									</DialogTitle>
								</DialogHeader>
								<form className="grid gap-6">
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
								</form>
								<DialogFooter>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm" type="reset">
											Discard
										</Button>
										<Button onClick={handleSave} size="sm" type="submit">
											Save Scenario
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</Card>
				</div>
			)}
		</main>
	);
}

export default Scenario;
