import {
	ChevronRightIcon,
	LineChart,
	MessagesSquareIcon,
	Settings2Icon,
	Target,
} from "lucide-react";

export default function IconSection() {
	return (
		<>
			{/* Icon Blocks */}
			<div className="container py-12 lg:py-16">
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-2">
					{/* Icon Block */}
					<a
						className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 "
						href="#"
					>
						<div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
							<Target className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
						</div>
						<div className="mt-5">
							<h3 className="text-lg font-semibold">Custom Job Scenario</h3>
							<p className="mt-1 text-muted-foreground">
								Tailored scenarios mimic real-world job tasks. Enhance
								preparedness with relevant job-specific challenges.
							</p>
							<span className="mt-2 inline-flex items-center gap-x-1.5 text-sm  decoration-2 group-hover:underline font-medium">
								Learn more
								<ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
							</span>
						</div>
					</a>
					{/* End Icon Block */}
					{/* Icon Block */}
					<a
						className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 "
						href="#"
					>
						<div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
							<Settings2Icon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
						</div>
						<div className="mt-5">
							<h3 className="text-lg font-semibold">{`100's of Parameters`}</h3>
							<p className="mt-1 text-muted-foreground">
								AI customizes interviews based on diverse criteria. Get a unique
								experience fitting your specific needs.
							</p>
							<span className="mt-2 inline-flex items-center gap-x-1.5 text-sm  decoration-2 group-hover:underline font-medium">
								Learn more
								<ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
							</span>
						</div>
					</a>
					{/* End Icon Block */}
					{/* Icon Block */}
					<a
						className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 "
						href="#"
					>
						<div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
							<LineChart className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
						</div>
						<div className="mt-5">
							<h3 className="text-lg font-semibold">Track Progress</h3>
							<p className="mt-1 text-muted-foreground">
								Monitor your improvement over time. Visual insights keep you
								motivated and on track.
							</p>
							<span className="mt-2 inline-flex items-center gap-x-1.5 text-sm  decoration-2 group-hover:underline font-medium">
								Learn more
								<ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
							</span>
						</div>
					</a>
					{/* End Icon Block */}
					{/* Icon Block */}
					<a
						className="group flex flex-col justify-center hover:bg-primary-foreground/90 rounded-lg p-4 md:p-7 "
						href="#"
					>
						<div className="flex justify-center items-center w-12 bg-primary h-12 border rounded-lg">
							<MessagesSquareIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
						</div>
						<div className="mt-5">
							<h3 className="text-lg font-semibold">Actionable Reports</h3>
							<p className="mt-1 text-muted-foreground">
								Receive detailed feedback for each session. Implement
								constructive advice to boost your skills.
							</p>
							<span className="mt-2 inline-flex items-center gap-x-1.5 text-sm  decoration-2 group-hover:underline font-medium">
								Learn more
								<ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
							</span>
						</div>
					</a>
					{/* End Icon Block */}
				</div>
			</div>
			{/* End Icon Blocks */}
		</>
	);
}
