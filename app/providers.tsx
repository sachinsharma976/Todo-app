'use client';

import { Provider } from 'react-redux';
import { persistor, store } from '@/lib/store/store'; // Redux store and persistor
import { SessionProvider } from 'next-auth/react'; // NextAuth session provider
import { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react'; // Redux Persist gate

// Props for the AuthSessionProvider component
interface AuthSessionProviderProps {
	children: ReactNode; // Children to be wrapped
	session: any; // Session object from NextAuth
}

// Provider component to wrap the app with Redux, Redux Persist, and NextAuth
export default function AuthSessionProvider({
	children,
	session,
}: AuthSessionProviderProps) {
	return (
		<SessionProvider session={session}>
			{/* Redux Provider to make the store available to the app */}
			<Provider store={store}>
				{/* Redux Persist Gate to delay rendering until the state is rehydrated */}
				<PersistGate loading={null} persistor={persistor}>
					{children}
				</PersistGate>
			</Provider>
		</SessionProvider>
	);
}