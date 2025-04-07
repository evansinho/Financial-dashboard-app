import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid login credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border my-2"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border my-2"
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
      <button onClick={() => signIn("google")} className="w-full mt-2 bg-red-500 text-white p-2">
        Login with Google
      </button>
      <p className="mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-500">Sign up</a>
      </p>
    </div>
  );
}
