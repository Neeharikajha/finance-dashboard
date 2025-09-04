"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import Header from "../components/newComponents/Header";
import DashboardGrid from "../components/newComponents/DashboardGrid";
import AddWidgetModal from "../components/newComponents/AddWidgetModal";
import WidgetConfigModal from "../components/newComponents/WidgetConfigModal";
import ApiTester from "../components/newComponents/ApiTester";

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

  // API Tester state
  const [showApiTester, setShowApiTester] = useState(false);

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
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setEditingWidget(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Widget
          </button>
          
          <button
            onClick={() => setShowApiTester(!showApiTester)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showApiTester ? "Hide" : "Test"} API
          </button>
        </div>

        {showApiTester && (
          <div className="mb-6">
            <ApiTester />
          </div>
        )}

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
