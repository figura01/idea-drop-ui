import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { createIdea } from "@/api/ideas";

export const Route = createFileRoute("/ideas/new/")({
  component: NewIdeaPage,
});

function NewIdeaPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex-justify-between items-cenetr mb-4">
        <h1 className="text-3xl font-bold mb-6">Create New Idea</h1>
        <Link to="/ideas" className="text-sm text-blue-600 hover:underline">
          ← Back To Idea
        </Link>
      </div>
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Tile
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            placeholder="Enter idea title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-gray-700 font-medium mb-1"
          >
            Summary
          </label>
          <input
            id="summary"
            type="text"
            name="summary"
            value={summary}
            placeholder="Enter idea summary"
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-1"
          >
            Tile
          </label>
          <textarea
            id="description"
            rows={6}
            name="description"
            value={description}
            placeholder="Enter idea description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-gray-700 font-medium mb-1"
          >
            Tags
          </label>
          <input
            id="tags"
            type="text"
            name="tags"
            value={tags}
            placeholder="Enter idea tags"
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
