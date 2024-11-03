"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            EventMap
          </Link>
          <Link href="/events" className="text-sm">
            Events
          </Link>
          {session?.user.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}