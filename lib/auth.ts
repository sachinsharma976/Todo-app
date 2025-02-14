import { getServerSession } from 'next-auth'; // NextAuth.js server-side session utility
import { NextAuthOptions } from 'next-auth'; // NextAuth.js configuration type
import CredentialsProvider from 'next-auth/providers/credentials'; // Credentials provider for email/password auth
import { compare } from 'bcryptjs'; // For password hashing comparison

// Mock user database (replace with your actual database)
interface User {
	id: string;
	email: string;
	password: string;
	name: string;
}

// Mock user data (replace with database queries in production)
const users: User[] = [
	{
		id: '1',
		email: 'admin@example.com',
		password: '$2a$12$SipUZjERJ6UDiqcbIpzX.OAN.89J2ragJPaR4NtunebGndjYyGMtO', // Hashed "admin123"
		name: 'John Doe',
	},
	{
		id: '2',
		email: 'user1@example.com',
		password: '$2a$12$DMY76EIedjcUpGF5F5cxxe5vH0/YzE76aNEEYSKXsvhkCM/Du0TcC', // Hashed "user123"
		name: 'Alice Smith',
	},
	{
		id: '3',
		email: 'user2@example.com',
		password: '$2a$12$dIU1pTkG8U76UtHg8iIXCujjlZoZiVsLuDm9yBHl1CQf5e5wUWCuy', // Hashed "password123"
		name: 'Bob Johnson',
	},
	{
		id: '4',
		email: 'user3@example.com',
		password: '$2a$12$7W7lvJfBWeQqCZt8asy0wur6XJNllD0Mr1SVJmHY3ykgpEE64UMiG', // Hashed "securePass"
		name: 'Emma Davis',
	},
];

// Utility function to get the server session
export async function auth() {
	return await getServerSession(authOptions);
}

// NextAuth.js configuration
export const authOptions: NextAuthOptions = {
	providers: [
		// Credentials provider for email/password authentication
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and password are required');
				}

				// Find user by email
				const user = users.find((u) => u.email === credentials.email);

				if (!user) {
					throw new Error('User not found');
				}

				// Compare hashed password
				const isValidPassword = await compare(
					credentials.password,
					user.password
				);

				if (!isValidPassword) {
					throw new Error('Invalid password');
				}

				// Return user object (without password)
				return {
					id: user.id,
					email: user.email,
					name: user.name,
				};
			},
		}),
	],
	callbacks: {
		// Add user ID to the session
		async session({ session, token }: any) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			return session;
		},
		// Add user ID to the JWT token
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
	secret: process.env.NEXTAUTH_SECRET, // Required for encryption
	pages: {
		signIn: '/auth/signin', // Custom sign-in page
	},
};