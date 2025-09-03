"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import Header from "../components/newComponents/Header";
import DashboardGrid from "../components/newComponents/DashboardGrid";
import AddWidgetModal from "../components/newComponents/AddWidgetModal";
import WidgetConfigModal from "../components/newComponents/WidgetConfigModal";

import { addWidget, removeWidget, editWidget } from "../store/widgetsSlice";

export default function HomePage() {
  const widgets = useSelector((state) => state.widgets.widgets);
  const dispatch = useDispatch();

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);

  // Config panel state
  const [isConfigOpen, setConfigOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState(null);

  // Add or update widget
  const handleAddWidget = (widget) => {
    if (editingWidget) {
      dispatch(editWidget({ ...widget, id: editingWidget.id }));
      setEditingWidget(null);
    } else {
      dispatch(addWidget({ ...widget, id: Date.now() }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteWidget = (id) => {
    dispatch(removeWidget(id));
  };

  const handleEditWidget = (widget) => {
    setEditingWidget(widget);
    setIsModalOpen(true);
  };

  const handleConfigWidget = (widget) => {
    setConfigWidget(widget);
    setConfigOpen(true);
  };

  const handleSaveConfig = (updatedProps) => {
    dispatch(editWidget(updatedProps));
    setConfigOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 max-w-7xl mx-auto">
        <button
          onClick={() => {
            setEditingWidget(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-6"
        >
          Add Widget
        </button>

        <DashboardGrid
          widgets={widgets}
          onDelete={handleDeleteWidget}
          onEdit={handleEditWidget}
          onConfig={handleConfigWidget}
        />
      </div>

      {/* Add/Edit Widget Modal */}
      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddWidget}
        editingWidget={editingWidget}
      />

      {/* Widget Configuration Panel */}
      <WidgetConfigModal
        isOpen={isConfigOpen}
        onClose={() => setConfigOpen(false)}
        widget={configWidget}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
