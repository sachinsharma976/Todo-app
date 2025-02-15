'use client';

import { LogOut, ListIcon } from 'lucide-react'; // Icons for dropdown menu
import { useSession, signOut } from 'next-auth/react'; // NextAuth hooks for session and sign-out
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Dropdown menu components
import { Button } from '@/components/ui/button'; // UI button component
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Avatar component
import Link from 'next/link'; // Client-side navigation

// User navigation dropdown component
export function UserNav() {
	const { data: session }: any = useSession(); // Get the user session

	// Return null if no session or user
	if (!session?.user) return null;

	return (
		<DropdownMenu>
			{/* Dropdown trigger (avatar button) */}
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
					<Avatar className='h-8 w-8'>
						{/* Display the first letter of the user's name or email as fallback */}
						<AvatarFallback>
							{session.user.name?.[0] || session.user.email?.[0]}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			{/* Dropdown menu content */}
			<DropdownMenuContent className='w-56' align='end' forceMount>
				{/* User information */}
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{session.user.name}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{session.user.email}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Link to the user's todos page */}
				<Link href={`/user/${session.user?.id}`}>
					<DropdownMenuItem>
						<ListIcon className='mr-2 h-4 w-4' />
						<span>My Todos</span>
					</DropdownMenuItem>
				</Link>

				<DropdownMenuSeparator />

				{/* Sign-out option */}
				<DropdownMenuItem className='text-red-600' onClick={() => signOut()}>
					<LogOut className='mr-2 h-4 w-4' />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}