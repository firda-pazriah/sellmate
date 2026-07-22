import type { Metadata } from "next";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login/login-form";

export const metadata: Metadata = {
  title: "Sign in — Sellmate",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sellmate</CardTitle>
          <CardDescription>
            Sign in with the account your business owner set up for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
