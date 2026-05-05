import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin sign-in" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-2xl font-bold">
            S
          </div>
          <h1 className="mt-5">Admin sign-in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Squamish Adventure Rentals operator portal
          </p>
        </div>
        <Suspense fallback={<div />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
