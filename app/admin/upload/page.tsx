"use client";

import { useState, FormEvent } from "react";

export default function AdminUploadPage() {
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStatus("done");
      setMessage(`Added "${data.artwork.title}" to the collection.`);
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-16">
      <div className="max-w-xl mx-auto">
        <p className="text-brass text-xs tracking-[0.3em] uppercase mb-2 font-body">Ayodeleart admin</p>
        <h1 className="font-display text-parchment text-3xl mb-8">Add a piece</h1>

        <form onSubmit={handleSubmit} className="space-y-5 font-body">
          <div>
            <label className="block text-parchment/70 text-sm mb-1">Admin key</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
              className="w-full bg-wall border border-brass/30 rounded px-3 py-2 text-parchment"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">Title</label>
            <input
              name="title"
              required
              className="w-full bg-wall border border-brass/30 rounded px-3 py-2 text-parchment"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">Category</label>
            <input
              name="category"
              placeholder="e.g. Oil on canvas"
              className="w-full bg-wall border border-brass/30 rounded px-3 py-2 text-parchment"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full bg-wall border border-brass/30 rounded px-3 py-2 text-parchment"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">Story / inspiration</label>
            <textarea
              name="story"
              rows={5}
              className="w-full bg-wall border border-brass/30 rounded px-3 py-2 text-parchment"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">Cover image</label>
            <input
              type="file"
              name="cover"
              accept="image/*"
              required
              className="w-full text-parchment/80 text-sm"
            />
          </div>

          <div>
            <label className="block text-parchment/70 text-sm mb-1">
              Additional detail-page images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="w-full text-parchment/80 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-brass text-ink font-medium rounded px-4 py-3 disabled:opacity-50"
          >
            {status === "saving" ? "Uploading…" : "Add to collection"}
          </button>

          {message && (
            <p className={status === "error" ? "text-clay" : "text-parchment/80"}>{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
