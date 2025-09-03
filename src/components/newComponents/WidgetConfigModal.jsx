"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editWidget } from "../../store/widgetsSlice";

export default function WidgetConfigModal({ isOpen, onClose, widget }) {
  const dispatch = useDispatch();
  const [color, setColor] = useState("#ffffff");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(150);

  useEffect(() => {
    if (widget) {
      setColor(widget.color || "#ffffff");
      setWidth(widget.width || 300);
      setHeight(widget.height || 150);
    }
  }, [widget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (widget) {
      dispatch(editWidget({ ...widget, color, width, height }));
    }
    onClose();
  };

  if (!isOpen || !widget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">Configure Widget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Background Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Width (px)</label>
            <input
              type="number"
              value={width}
              min={50}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Height (px)</label>
            <input
              type="number"
              value={height}
              min={50}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
