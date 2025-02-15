'use client';

import { useState } from 'react';
import { Row } from '@tanstack/react-table'; // Core table row type
import { Check, MoreHorizontal, Pencil, Trash, X } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button'; // Custom button component
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Custom dropdown menu component
import { Todo, useUpdateTodoMutation } from '@/lib/store/services/todos'; // Todo type and API mutation
import { toast } from 'sonner'; // Toast notifications
import { EditTodoDialog } from '@/components/TodoDialogs/EditTodoDialog'; // Edit dialog component
import { DeleteTodoDialog } from '@/components/TodoDialogs/DeleteTodoDialog'; // Delete dialog component
import { useSession } from 'next-auth/react'; // Session management

// Props interface for the DataTableRowActions component
interface DataTableRowActionsProps<TData extends Todo> {
	row: Row<TData>; // Table row data
}

// Row actions component for the data table
export function DataTableRowActions<TData extends Todo>({
	row,
}: DataTableRowActionsProps<TData>) {
	const { data: session }: any = useSession(); // Get user session
	const [updateTodo] = useUpdateTodoMutation(); // Mutation to update todo status
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog

	// Toggle todo status (completed/pending)
	const handleToggleStatus = async () => {
		try {
			await updateTodo({
				id: row.original.id,
				completed: !row.original.completed,
				userId: session.user?.id,
			}).unwrap();
			toast.success('Todo status updated successfully'); // Success toast
		} catch (error) {
			toast.error('Failed to update todo status'); // Error toast
		}
	};

	return (
		<>
			{/* Dropdown menu for row actions */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
					>
						<MoreHorizontal className='h-4 w-4' />
						<span className='sr-only'>Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-[160px]'>
					{/* Toggle todo status */}
					<DropdownMenuItem onClick={handleToggleStatus}>
						{row.original.completed ? (
							<>
								<X className='mr-2 h-4 w-4' />
								Mark as Pending
							</>
						) : (
							<>
								<Check className='mr-2 h-4 w-4' />
								Mark as Completed
							</>
						)}
					</DropdownMenuItem>

					{/* Open edit dialog */}
					<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
						<Pencil className='mr-2 h-4 w-4' />
						Edit
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{/* Open delete dialog */}
					<DropdownMenuItem
						className='text-red-600'
						onClick={() => setIsDeleteDialogOpen(true)}
					>
						<Trash className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Edit todo dialog */}
			<EditTodoDialog
				todo={row.original}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			/>

			{/* Delete todo dialog */}
			<DeleteTodoDialog
				todoId={row.original.id}
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			/>
		</>
	);
}
