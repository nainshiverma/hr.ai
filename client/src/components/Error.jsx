function Error() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
			<div className="mx-auto grid w-[450px] gap-6 bg-white p-6 rounded-lg shadow-md">
				<div className="grid gap-2 text-left">
					<h1 className="text-3xl font-bold">Oops!</h1>
					<p className="text-balance text-muted-foreground">
						The page you were looking for was not found!
					</p>
				</div>
			</div>
		</div>
	);
}

export default Error;
