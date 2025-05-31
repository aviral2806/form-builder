import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewModal from "./PreviewModal";

export default function BottomBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 w-full transition-all border-t bg-white dark:bg-zinc-900 ${
          collapsed ? "h-4" : "h-20"
        } duration-300 z-50`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-zinc-800 border rounded-full p-1 shadow"
        >
          {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {!collapsed && (
          <div className="flex justify-center items-center h-full gap-4">
            <button
              onClick={handlePreviewClick}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Preview
            </button>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-colors">
              Save
            </button>
          </div>
        )}
      </div>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
      />
    </>
  );
}
