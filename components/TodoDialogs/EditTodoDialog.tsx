'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTodoMutation } from '@/lib/store/services/todos';
import { toast } from 'sonner';
import { Todo } from '@/lib/store/services/todos';
import { useSession } from 'next-auth/react';

// Define form validation schema
const formSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
	completed: z.boolean(),
});

interface EditTodoDialogProps {
	todo: Todo;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
	const { data: session } = useSession();
	const [updateTodo] = useUpdateTodoMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize form with default values
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: todo.title,
			completed: todo.completed,
		},
	});

	// Handle form submission
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);
		try {
			if (!session?.user?.id) {
				toast.error('User not authenticated');
				return;
			}

			await updateTodo({
				id: todo.id,
				title: values.title,
				completed: values.completed,
				userId: session.user.id,
			}).unwrap();

			toast.success('Todo updated successfully');
			onOpenChange(false);
		} catch (error) {
			toast.error('Failed to update todo');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px] w-[90%]'>
				<DialogHeader>
					<DialogTitle>Edit Todo</DialogTitle>
					<DialogDescription>Update the details of your todo item.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						{/* Title Input Field */}
						<FormField
							control={form.control}
							name='title'	
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Enter todo title' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Completed Checkbox */}
						<FormField
							control={form.control}
							name='completed'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>Mark as completed</FormLabel>
								</FormItem>
							)}
						/>

						{/* Dialog Actions */}
						<DialogFooter>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
