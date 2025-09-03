"use client";
import { useState, useEffect } from "react";

export default function AddWidgetModal({ isOpen, onClose, onAdd, editingWidget }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingWidget) {
      setTitle(editingWidget.title);
      setContent(editingWidget.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingWidget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAdd({ title, content });
    setTitle("");
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingWidget ? "Edit Widget" : "Add Widget"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Widget title"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Widget content"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              {editingWidget ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
