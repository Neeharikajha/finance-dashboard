// // "use client";
// // import React from "react";
// // import RGL, { WidthProvider } from "react-grid-layout";
// // import WidgetCard from "./WidgetCard";

// // import "react-grid-layout/css/styles.css";
// // import "react-resizable/css/styles.css";

// // const ReactGridLayout = WidthProvider(RGL);

// // export default function DashboardGrid({ widgets, onDelete, onEdit, onConfig }) {
// //   // Generate layout from widgets
// //   const layout = widgets.map((widget, index) => ({
// //     i: widget.id.toString(),
// //     x: widget.x || (index % 3),
// //     y: widget.y || Math.floor(index / 3),
// //     w: widget.w || 1,
// //     h: widget.h || 1,
// //   }));

// //   const handleLayoutChange = (newLayout) => {
// //     // Optional: update Redux store for positions & sizes
// //     console.log("New layout", newLayout);
// //   };

// //   return (
// //     <ReactGridLayout
// //       className="layout"
// //       layout={layout}
// //       cols={3}
// //       rowHeight={150}
// //       width={1200}
// //       onLayoutChange={handleLayoutChange}
// //       draggableHandle=".drag-handle"
// //     >
// //       {widgets.map((widget) => (
// //         <div key={widget.id} className="p-2">
// //           <WidgetCard
// //             widget={widget}
// //             onDelete={onDelete}
// //             onEdit={onEdit}
// //             onConfig={onConfig}
// //           />
// //         </div>
// //       ))}
// //     </ReactGridLayout>
// //   );
// // }
// this was working


"use client";
import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import WidgetCard from "./WidgetCard";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export default function DashboardGrid({ widgets, onDelete, onEdit, onConfig }) {
  // Generate layout from widgets (convert px → grid units)
  const layout = widgets.map((widget, index) => ({
    i: widget.id.toString(),
    x: widget.x || (index % 3),
    y: widget.y || Math.floor(index / 3),
    w: widget.width ? Math.max(1, Math.round(widget.width / 150)) : (widget.w || 1),
    h: widget.height ? Math.max(1, Math.round(widget.height / 150)) : (widget.h || 1),
  }));

  const handleLayoutChange = (newLayout) => {
    console.log("New layout", newLayout);
  };

  return (
    <ReactGridLayout
      className="layout"
      layout={layout}
      cols={3}
      rowHeight={150} // each "h" unit = 150px
      width={1200}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
      isResizable
      isDraggable
    >
      {widgets.map((widget) => (
        <div key={widget.id} className="p-2">
          <WidgetCard
            widget={widget}
            onDelete={onDelete}
            onEdit={onEdit}
            onConfig={onConfig}
          />
        </div>
      ))}
    </ReactGridLayout>
  );
}
