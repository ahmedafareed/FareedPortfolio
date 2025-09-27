"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await fetch('/api/admin-logout', { method: 'POST' });
      router.replace('/login');
    })();
  }, [router]);
  return null;
}
