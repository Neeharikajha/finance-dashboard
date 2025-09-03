// "use client";

// export default function WidgetCard({ widget, onDelete, onEdit, onConfig }) {
//   return (
//     <div
//       className="shadow rounded p-4 relative"
//       style={{ backgroundColor: widget.color || "#ffffff" }}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="font-semibold text-lg">{widget.title}</h2>
//         <span className="cursor-move drag-handle text-gray-400">⠿</span>
//       </div>
//       <p>{widget.content}</p>
//       <div className="flex justify-end gap-2 mt-2">
//         <button
//           onClick={() => onEdit(widget)}
//           className="px-2 py-1 bg-yellow-400 text-white rounded"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(widget.id)}
//           className="px-2 py-1 bg-red-600 text-white rounded"
//         >
//           Delete
//         </button>
//         <button
//           onClick={() => onConfig(widget)}
//           className="px-2 py-1 bg-blue-500 text-white rounded"
//         >
//           ⚙
//         </button>
//       </div>
//     </div>
//   );
// }

// this was wroking


"use client";

export default function WidgetCard({ widget, onDelete, onEdit, onConfig }) {
  return (
    <div
      className="shadow rounded p-4 relative"
      style={{
        backgroundColor: widget.color || "#ffffff",
        width: widget.width ? `${widget.width}px` : "100%",
        height: widget.height ? `${widget.height}px` : "auto",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">{widget.title}</h2>
        <span className="cursor-move drag-handle text-gray-400">⠿</span>
      </div>
      <p>{widget.content}</p>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => onEdit(widget)}
          className="px-2 py-1 bg-yellow-400 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(widget.id)}
          className="px-2 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
        <button
          onClick={() => onConfig(widget)}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
