
// "use client";
// import React from "react";
// import RGL, { WidthProvider } from "react-grid-layout";
// import WidgetCard from "./WidgetCard";
// import { useDispatch } from "react-redux";
// import { updateWidgetLayout } from "../../store/widgetsSlice";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";

// const ReactGridLayout = WidthProvider(RGL);

// export default function DashboardGrid({ widgets, onDelete, onEdit, onConfig }) {
//   const dispatch = useDispatch();

//   // Generate layout from widgets
  
//   const layout = widgets.map((widget, index) => ({
//     i: widget.id.toString(),
//     x: widget.x || (index % 3),
//     y: widget.y || Math.floor(index / 3),
//     w: widget.w || 1,
//     h: widget.h || 2, // Default height of 2 grid units
//   }));

//   const handleLayoutChange = (newLayout) => {
//     // Update the Redux store with new layout positions
//     dispatch(updateWidgetLayout(newLayout));
//   };

//   return (
//     <div className="dashboard-grid">
//       <ReactGridLayout
//         className="layout"
//         layout={layout}
//         cols={12}
//         rowHeight={60}
//         width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 1200) : 1200}
//         onLayoutChange={handleLayoutChange}
//         isResizable={true}
//         isDraggable={true}
//         draggableHandle=".drag-handle"
//         compactType="vertical"
//         preventCollision={false}
//         useCSSTransforms={true}
//         margin={[16, 16]}
//         containerPadding={[16, 16]}
//         resizeHandles={['se']}
//         breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//         cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//       >
//         {widgets.map((widget) => (
//           <div key={widget.id} className="widget-container">
//             <WidgetCard
//               widget={widget}
//               onDelete={onDelete}
//               onEdit={onEdit}
//               onConfig={onConfig}
//             />
//           </div>
//         ))}
//       </ReactGridLayout>
      
//       <style jsx>{`
//         .dashboard-grid {
//           min-height: 100vh;
//         }
        
//         .layout {
//           position: relative;
//         }
        
//         .widget-container {
//           height: 100%;
//           width: 100%;
//         }
        
//         .react-grid-item {
//           transition: all 200ms ease;
//           transition-property: left, top;
//         }
        
//         .react-grid-item.cssTransforms {
//           transition-property: transform;
//         }
        
//         .react-grid-item > .react-resizable-handle {
//           position: absolute;
//           width: 20px;
//           height: 20px;
//           bottom: 0;
//           right: 0;
//           background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBkPSJtNiAwaC0xdi0xaDF6bS0yIDBoLTF2LTFoMXptLTIgMGgtMXYtMWgxem0tMiAwaC0xdi0xaDF6bS0yIDBoLTF2LTFoMXptLTItMWgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTItMWgxdjFoLTF6bS0yIDBoLTF2MWgxem0tMiAwaC0xdjFoMXptLTIgMGgtMXYxaDF6bS0yIDBoLTF2MWgxem0tMiAwaC0xdjFoLTF6bTItMWgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6Ii8+Cjwvc3ZnPgo=');
//           background-position: bottom right;
//           padding: 0 3px 3px 0;
//           background-repeat: no-repeat;
//           background-origin: content-box;
//           box-sizing: border-box;
//           cursor: se-resize;
//         }
//       `}</style>
//     </div>
//   );
// }





"use client";
import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import WidgetCard from "./WidgetCard";
import { useDispatch } from "react-redux";
import { updateWidgetLayout } from "../../store/widgetsSlice";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export default function DashboardGrid({ widgets, onDelete, onEdit, onConfig, setWidgets }) {
  const dispatch = useDispatch();

  // Generate layout from widgets
  const layout = widgets.map((widget, index) => ({
    i: widget.id.toString(),
    x: widget.x || (index % 3),
    y: widget.y || Math.floor(index / 3),
    w: widget.w || 1,
    h: widget.h || 2, // Default height of 2 grid units
  }));

  const handleLayoutChange = (newLayout) => {
    // Update layout positions in Redux
    dispatch(updateWidgetLayout(newLayout));
  };

  // 🔹 Export full dashboard (config + data)
  const handleExport = () => {
    const dataStr = JSON.stringify(widgets, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard-full.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Import dashboard
  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setWidgets(imported); // replace current dashboard
        } else {
          alert("Invalid dashboard file format!");
        }
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  return (
    <div className="dashboard-grid">
      {/* 🔹 Export/Import Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Export Dashboard
        </button>

        <label className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
          Import Dashboard
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {/* 🔹 Widgets Grid */}
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={60}
        width={typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 1200) : 1200}
        onLayoutChange={handleLayoutChange}
        isResizable={true}
        isDraggable={true}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        resizeHandles={["se"]}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-container">
            <WidgetCard
              widget={widget}
              onDelete={onDelete}
              onEdit={onEdit}
              onConfig={onConfig}
            />
          </div>
        ))}
      </ReactGridLayout>

      <style jsx>{`
        .dashboard-grid {
          min-height: 100vh;
        }
        .layout {
          position: relative;
        }
        .widget-container {
          height: 100%;
          width: 100%;
        }
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          cursor: se-resize;
        }
      `}</style>
    </div>
  );
}
