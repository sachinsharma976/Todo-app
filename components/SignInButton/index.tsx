'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignInButton() {
  const router = useRouter();
  const { data: session } = useSession();

  // Hide button if user is already signed in
  if (session) return null;

  return (
    <Button onClick={() => router.push('/auth/signin')} className="flex items-center">
      Sign In
    </Button>
  );
}
