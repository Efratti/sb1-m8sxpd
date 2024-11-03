"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { MapPin, Calendar, User, LogOut } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          <MapPin className="inline-block mr-2" />
          Map Events
        </Link>
        <Link
          href="/events"
          className={`${isActive("/events") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Calendar className="inline-block mr-1" />
          Events
        </Link>
        {session?.user.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`${isActive("/admin") ? "text-primary" : "text-muted-foreground"}`}
          >
            Admin
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-muted-foreground">
              <User className="inline-block mr-1" />
              {session.user.email}
            </span>
            <Button variant="ghost" onClick={() => signOut()}>
              <LogOut className="mr-1" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}