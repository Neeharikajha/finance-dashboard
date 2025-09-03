"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Header from "../components/newComponents/Header";
import DashboardGrid from "../components/newComponents/DashboardGrid";
import AddWidgetModal from "../components/newComponents/AddWidgetModal";
import { addWidget, removeWidget, editWidget } from "../store/widgetsSlice";

export default function HomePage() {
  const widgets = useSelector((state) => state.widgets.widgets);
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);

  const handleAddWidget = (widget) => {
    if (editingWidget) {
      dispatch(editWidget({ ...widget, id: editingWidget.id }));
      setEditingWidget(null);
    } else {
      dispatch(addWidget({ ...widget, id: Date.now() }));
    }
  };

  const handleDeleteWidget = (id) => {
    dispatch(removeWidget(id));
  };

  const handleEditWidget = (widget) => {
    setEditingWidget(widget);
    setModalOpen(true); // reuse modal for editing
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 max-w-7xl mx-auto">
        <button
          onClick={() => { setEditingWidget(null); setModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-6"
        >
          Add Widget
        </button>

        <DashboardGrid
          widgets={widgets}
          onDelete={handleDeleteWidget}
          onEdit={handleEditWidget}
        />
      </div>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddWidget}
        editingWidget={editingWidget} // pass current widget to prefill modal
      />
    </div>
  );
}
