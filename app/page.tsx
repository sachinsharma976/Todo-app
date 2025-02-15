import { publicTodoColumns } from '@/components/data-table/columns'; // Columns for the data table
import { DataTable } from '@/components/data-table/data-table'; // Reusable data table component
import { UserNav } from '@/components/auth/user-nav'; // User navigation component
import ServerErrorPage from '@/components/ServerError'; // Component to display server errors
import SignInButton from '@/components/SignInButton'; // Button for signing in

// Fetch todos from an external API
async function getTodos() {
	try {
		const res = await fetch('https://jsonplaceholder.typicode.com/todos');
		const todos = await res.json();
		return { data: todos, error: null }; // Return data if successful
	} catch (err) {
		return { error: err, data: null }; // Return error if fetch fails
	}
}

// Home page component
export default async function Home() {
	const { data, error } = await getTodos(); // Fetch todos

	if (error) {
		return <ServerErrorPage />; // Show error page if fetch fails
	}

	return (
		<div className='space-y-6'>
			{/* Header section */}
			<div className='border-b'>
				<div className='flex h-16 items-center px-4'>
					<h1 className='text-2xl font-bold'>Todo Management</h1>
					{/* Sign-in button and user navigation */}
					<div className='ml-auto flex items-center space-x-4'>
						<SignInButton />
						<UserNav />
					</div>
				</div>
			</div>
			{/* Data table to display todos */}
			<div className='container mx-auto py-10 px-8'>
				<DataTable columns={publicTodoColumns} data={data} />
			</div>
		</div>
	);
}
