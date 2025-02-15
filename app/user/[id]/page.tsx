'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Hook to access session data
import { useRouter } from 'next/navigation'; // Hook for client-side navigation
import { useState } from 'react';
import { useGetTodosQuery } from '@/lib/store/services/todos'; // RTK Query hook to fetch todos
import { privateTodoColumns } from '@/components/data-table/columns'; // Columns for the private todos table
import { DataTable } from '@/components/data-table/data-table'; // Reusable data table component
import { UserNav } from '@/components/auth/user-nav'; // User navigation component
import { Button } from '@/components/ui/button'; // UI button component
import { PlusCircle } from 'lucide-react'; // Icon for the add todo button
import { CreateTodoDialog } from '@/components/todos/create-todo-dialog'; // Dialog for creating todos
import ServerErrorPage from '@/components/ServerError';
import Loader from '@/components/Loader';

// Props for the UserTodos component
interface UserProfileProps {
	params: {
		id: string; // User ID from the URL
	};
}

// Component to display todos for a specific user
export default function UserTodos({ params }: UserProfileProps) {
	const { data: session, status } = useSession(); // Get the user session
	const { id } = params; // Extract user ID from params
	const router = useRouter(); // Router for navigation
	const { data: todos = [], isLoading, error } = useGetTodosQuery(id); // Fetch todos for the user
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State to manage create todo dialog

	// Redirect to sign-in page if the user is unauthenticated
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
		}
	}, [status, router]);

	// Show loading state while fetching session or todos
	if (status === 'loading' || isLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader />
			</div>
		);
	}

	// Show error message if there's an error fetching todos
	if (error) {
		return <ServerErrorPage />;
	}

	// Return null if there's no session (handled by useEffect)
	if (!session) {
		return null;
	}

	return (
		<div className='space-y-6'>
			{/* Header section */}
			<div className='border-b'>
				<div className='flex h-16 items-center px-4'>
					<h1 className='text-2xl font-bold'>Todo Management</h1>
					{/* User navigation */}
					<div className='ml-auto flex items-center space-x-4'>
						<UserNav />
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className='container mx-auto py-10 px-8'>
				{/* Button to open the create todo dialog */}
				<Button
					onClick={() => setIsCreateDialogOpen(true)}
					className='flex items-center mb-4 ml-auto'
				>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add Todo
				</Button>

				{/* Data table to display todos */}
				<DataTable columns={privateTodoColumns} data={todos} />
			</div>

			{/* Dialog for creating todos */}
			<CreateTodoDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			/>
		</div>
	);
}
