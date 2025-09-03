// "use client";

// import WidgetCard from "./WidgetCard";

// export default function DashboardGrid({ widgets }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//       {widgets.map((widget) => (
//         <WidgetCard key={widget.id} widget={widget} />
//       ))}
//     </div>
//   );
// }

"use client";

import WidgetCard from "./WidgetCard";

export default function DashboardGrid({ widgets, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          onDelete={onDelete}
          onEdit={onEdit} // must pass this!
        />
      ))}
    </div>
  );
}