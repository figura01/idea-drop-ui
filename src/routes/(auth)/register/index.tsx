import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const { mutateAsync: registerMutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      setError(error.message || "Registration failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutate({ name, email, password });
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="w-full border border-gray rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoComplete="off"
        />

        <input
          type="text"
          name="email"
          className="w-full border border-gray rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          className="w-full border border-gray rounded-md p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="off"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 w-full rounded-md diasbled:opacity-50">
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
