import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  ) : (
    <button onClick={() => signIn("google")} className="bg-blue-500 text-white px-4 py-2 rounded">
      Login with Google
    </button>
  );
}
