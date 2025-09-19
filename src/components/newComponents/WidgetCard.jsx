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
import TableWidget from "./widgets/TableWidget";
import FinanceCardWidget from "./widgets/FinanceCardWidget";
import ChartWidget from "./widgets/ChartWidget";

export default function WidgetCard({ widget, onDelete, onEdit, onConfig }) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        return <TableWidget widget={widget} />;
      case 'finance_card':
        return <FinanceCardWidget widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      default:
        return (
          <div className="p-4">
            <p className="text-gray-500">Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className="shadow rounded-lg relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      style={{
        backgroundColor: widget.color || undefined,
        width: widget.width ? `${widget.width}px` : "100%",
        height: widget.height ? `${widget.height}px` : "400px",
      }}
    >
      {/* Widget Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 dark:bg-gray-900/40 rounded-t-lg border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="cursor-move drag-handle text-gray-400 text-lg">⠿</span>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{widget.title}</h2>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {widget.type?.replace('_', ' ').toUpperCase() || 'WIDGET'}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(widget)}
            className="p-1 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded"
            title="Edit Widget"
          >
            ✏️
          </button>
          <button
            onClick={() => onConfig(widget)}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
            title="Configure Widget"
          >
            ⚙️
          </button>
          <button
            onClick={() => onDelete(widget.id)}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
            title="Delete Widget"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4 h-full overflow-hidden text-gray-900 dark:text-gray-100" style={{ height: `calc(100% - 60px)` }}>
        {renderWidgetContent()}
      </div>
    </div>
  );
}
