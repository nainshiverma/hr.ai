"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function Charts() {
	return (
		<div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-left gap-6 p-6 sm:flex-row sm:p-8">
			<div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
				<Card className="lg:max-w-md" x-chunk="charts-01-chunk-0">
					<CardHeader className="space-y-0 pb-2">
						<CardDescription>Total Sessions</CardDescription>
						<CardTitle className="text-4xl tabular-nums">
							2{" "}
							<span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
								pending
							</span>
						</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
