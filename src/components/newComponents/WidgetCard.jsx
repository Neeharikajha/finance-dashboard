// "use client";

// export default function WidgetCard({ widget }) {
//   return (
//     <div className="bg-white shadow rounded p-4 relative">
//       <h2 className="font-semibold text-lg">{widget.title}</h2>
//       <p>{widget.content}</p>
//     </div>
//   );
// }

"use client";

export default function WidgetCard({ widget, onDelete, onEdit }) {
  return (
    <div className="bg-white shadow rounded p-4 relative">
      <h2 className="font-semibold text-lg">{widget.title}</h2>
      <p>{widget.content}</p>

      <div className="flex justify-end gap-2 mt-2">
        {/* <button
          onClick={() => onEdit(widget)}
          className="px-2 py-1 bg-yellow-400 text-white rounded"
        >Edit
        </button> */}
        <button onClick={() => onEdit(widget)} className="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
        <button
          onClick={() => onDelete(widget.id)}
          className="px-2 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
