'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Form management library
import { zodResolver } from '@hookform/resolvers/zod'; // Zod validation resolver
import * as z from 'zod'; // Schema validation library
import { signIn, useSession } from 'next-auth/react'; // NextAuth hooks for authentication
import { useRouter } from 'next/navigation'; // Router for client-side navigation
import { Button } from '@/components/ui/button'; // UI button component
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'; // Form components
import { Input } from '@/components/ui/input'; // Input component
import { toast } from 'sonner'; // Toast notifications library
import Loader from '@/components/Loader';

// Define the form schema using Zod
const formSchema = z.object({
	email: z.string().email('Invalid email address'), // Validate email
	password: z.string().min(6, 'Password must be at least 6 characters'), // Validate password
});

export default function SignIn() {
	const router = useRouter();
	const { status, data }: any = useSession(); // Get session status and data
	const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

	// Redirect to user page if already authenticated
	useEffect(() => {
		if (status === 'authenticated') {
			router.push(`/user/${data.user.id}`);
		}
	}, [status, router, data]);

	// Initialize the form with default values and validation
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Handle form submission
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			// Sign in using credentials
			const result = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
			});

			// Handle sign-in errors
			if (result?.error) {
				toast.error('Invalid credentials');
				return;
			}

			// Fetch session to get user ID
			const session = await fetch('/api/auth/session').then((res) => res.json());
			if (session?.user?.id) {
				router.push(`/user/${session.user.id}`); // Redirect to user page
			} else {
				toast.error('An error occurred during sign in');
				console.error('Failed to fetch user ID');
			}
		} catch (error) {
			toast.error('An error occurred during sign in');
		} finally {
			setIsLoading(false); // Reset loading state
		}
	}

	// Show loading state while checking session
	if (status === 'loading') {
		return (
			<Loader />
		);
	}

	// Return null if already authenticated (redirect handled by useEffect)
	if (status === 'authenticated') {
		return null;
	}

	// Render the sign-in form
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50'>
			<div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight'>Sign in</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Enter your credentials to access your account
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{/* Email field */}
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='Enter your email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password field */}
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Enter your password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit button */}
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}