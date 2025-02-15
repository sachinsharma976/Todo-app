'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteTodoMutation } from '@/lib/store/services/todos';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Define the props for the DeleteTodoDialog component
interface DeleteTodoDialogProps {
	todoId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteTodoDialog({ todoId, open, onOpenChange }: DeleteTodoDialogProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const [deleteTodo] = useDeleteTodoMutation();

	const handleDelete = async () => {
		// Redirect to sign-in if the user is not authenticated
		if (!session?.user?.id) {
			toast.error('You must be logged in to delete a todo.');
			router.push('/auth/signin');
			return;
		}

		try {
			// Delete the todo using the mutation
			await deleteTodo({ userId: session.user.id, id: todoId }).unwrap();
			toast.success('Todo deleted successfully');
			onOpenChange(false);
		} catch (error) {
			toast.error('Failed to delete todo');
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the todo item.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
