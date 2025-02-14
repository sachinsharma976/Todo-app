import { authOptions } from '@/lib/auth'; // Authentication options for NextAuth
import NextAuth from 'next-auth'; // NextAuth library

// Create the NextAuth handler with the provided options
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };