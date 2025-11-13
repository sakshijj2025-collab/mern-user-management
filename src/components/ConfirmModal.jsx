import React from "react";

const ConfirmModal = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Delete",
  confirmColor = "red",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              confirmColor === "red"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
