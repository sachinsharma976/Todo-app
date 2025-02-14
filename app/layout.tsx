import './globals.css';
import type { Metadata } from 'next'; // Type for Next.js metadata
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner'; // Toast notifications component
import { auth } from '@/lib/auth'; // Function to fetch the session
import AuthSessionProvider from './providers'; // Custom provider for session and Redux

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

// ✅ Type for session.user
interface CustomUser {
	id: number;
	name?: string;
	email?: string;
	image?: string;
  }
  
  // ✅ Extend session type
  declare module "next-auth" {
	interface Session {
	  user: CustomUser;
	}
  }

// Metadata for the application
export const metadata: Metadata = {
	title: 'Todo Management System',
	description: 'A modern todo management system built with Next.js',
};

// Root layout component for the application
export default async function RootLayout({
	children,
}: {
	children: React.ReactNode; // Children components to be rendered
}) {
	const session = await auth(); // Fetch the session

	return (
		<html lang='en'>
			<body className={inter.className}>
				{/* Wrap the app with AuthSessionProvider to provide session and Redux store */}
				<AuthSessionProvider session={session}>
					{children} {/* Render the children components */}
					<Toaster /> {/* Toast notifications for user feedback */}
				</AuthSessionProvider>
			</body>
		</html>
	);
}