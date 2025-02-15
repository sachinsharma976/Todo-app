import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; // RTK Query utilities
import { toast } from 'sonner'; // Toast notifications

// Define the Todo interface
export interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

// Create the API service
export const todosApi = createApi({
	reducerPath: 'todosApi', // Unique key for the reducer
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://jsonplaceholder.typicode.com/', // Base URL for API requests
	}),
	tagTypes: ['Todo'], // Tag for cache invalidation
	endpoints: (builder) => ({
		// Fetch todos for a specific user
		getTodos: builder.query<Todo[], string>({
			query: (userId: string) => ({
				url: `todos?userId=${userId}`,
				method: 'GET',
			}),
			providesTags: ['Todo'], // Tag for caching
		}),

		// Add a new todo
		addTodo: builder.mutation<Todo, Partial<Todo>>({
			query: (todo) => ({
				url: 'todos',
				method: 'POST',
				body: todo,
			}),
			async onQueryStarted(newTodo, { dispatch, queryFulfilled }) {
				// Optimistically update the cache
				try {
					await queryFulfilled; // Wait for the request to complete
					dispatch(
						todosApi.util.updateQueryData(
							'getTodos',
							newTodo.userId?.toString() || '',
							(draft) => {
								draft.push(newTodo as Todo); // Add the new todo to the list
							}
						)
					);
				} catch (err) {
					toast.error('Failed to add todo'); // Error toast
					console.error(err);
				}
			},
		}),

		// Update an existing todo
		updateTodo: builder.mutation<Todo, Partial<Todo>>({
			query: (todo) => ({
				url: `todos/${todo.id}`,
				method: 'PUT',
				body: todo,
			}),
			async onQueryStarted(updatedTodo, { dispatch, queryFulfilled }) {
				// Optimistically update the cache
				try {
					await queryFulfilled; // Wait for the request to complete
					dispatch(
						todosApi.util.updateQueryData(
							'getTodos',
							updatedTodo.userId?.toString() || '',
							(draft) => {
								const index = draft.findIndex((t) => t.id === updatedTodo.id);
								if (index !== -1) {
									draft[index] = { ...draft[index], ...updatedTodo }; // Update the todo
								}
							}
						)
					);
				} catch (err) {
					toast.error('Failed to update todo'); // Error toast
					console.error(err);
				}
			},
		}),

		// Delete a todo
		deleteTodo: builder.mutation<void, Partial<Todo>>({
			query: (todo) => ({
				url: `todos/${todo.id}`,
				method: 'DELETE',
			}),
			async onQueryStarted(deleteTodo, { dispatch, queryFulfilled }) {
				// Optimistically update the cache
				try {
					await queryFulfilled; // Wait for the request to complete
					dispatch(
						todosApi.util.updateQueryData(
							'getTodos',
							deleteTodo.userId?.toString() || '',
							(draft) => {
								const index = draft.findIndex((t) => t.id === deleteTodo.id);
								if (index !== -1) {
									draft.splice(index, 1); // Remove the todo
								}
							}
						)
					);
				} catch (err) {
					toast.error('Failed to delete todo'); // Error toast
					console.error(err);
				}
			},
		}),
	}),
});

// Export hooks for usage in components
export const {
	useGetTodosQuery,
	useAddTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
} = todosApi;