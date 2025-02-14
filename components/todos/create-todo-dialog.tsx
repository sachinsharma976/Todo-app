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
import { Todo, useAddTodoMutation } from '@/lib/store/services/todos';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

// ✅ Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
});

// ✅ Define props with types
interface CreateTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTodoDialog({ open, onOpenChange }: CreateTodoDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [addTodo] = useAddTodoMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Get todos for the logged-in user safely
  const userId = session?.user?.id;
  const todos = useSelector(
    (state: RootState) =>
      (state.todosApi.queries[`getTodos("${userId}")`]?.data as Todo[]) || []
  );
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  // ✅ Submit handler with session check
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      router.push('/auth/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTodo({
        title: values.title,
        completed: false,
        userId,
        id: todos.length + 1,
      }).unwrap();

      toast.success('Todo created successfully');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>Add a new task to your todo list.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter todo title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
