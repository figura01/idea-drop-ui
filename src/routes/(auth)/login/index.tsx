import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ email, password });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
