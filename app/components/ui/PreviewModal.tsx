import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import Modal from "./Modal";
import FormPreview from "./FormPreview";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const handleDeviceSelect = (device: string) => {
    setSelectedDevice(device);
  };

  const handleBack = () => {
    setSelectedDevice(null);
  };

  const handleClose = () => {
    setSelectedDevice(null);
    onClose();
  };

  // Device container configurations - FIXED BORDERS
  const getDeviceContainer = (device: string) => {
    switch (device) {
      case "mobile":
        return {
          containerClass: "w-[375px] h-[667px] mx-auto flex-shrink-0",
          frameClass:
            "bg-gray-800 rounded-[2rem] p-3 w-full h-full shadow-xl border-2 border-gray-700",
          screenClass:
            "w-full h-full bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-auto border border-gray-300 dark:border-zinc-700",
          scale: "scale-75 sm:scale-90 lg:scale-100",
        };
      case "tablet":
        return {
          containerClass: "w-[768px] h-[1024px] mx-auto flex-shrink-0",
          frameClass:
            "bg-gray-800 rounded-[1.5rem] p-3 w-full h-full shadow-xl border-2 border-gray-700",
          screenClass:
            "w-full h-full bg-white dark:bg-zinc-900 rounded-[1rem] overflow-auto border border-gray-300 dark:border-zinc-700",
          scale: "scale-45 sm:scale-55 lg:scale-65",
        };
      case "laptop":
        return {
          containerClass: "w-[1200px] h-[700px] mx-auto flex-shrink-0",
          frameClass:
            "bg-gray-800 rounded-lg p-3 w-full h-full shadow-xl border-2 border-gray-700",
          screenClass:
            "w-full h-full bg-white dark:bg-zinc-900 rounded overflow-auto border border-gray-300 dark:border-zinc-700",
          scale: "scale-50 sm:scale-60 lg:scale-70",
        };
      default:
        return {
          containerClass: "w-full h-full",
          frameClass: "",
          screenClass: "w-full h-full bg-white dark:bg-zinc-900 overflow-auto",
          scale: "scale-100",
        };
    }
  };

  if (!selectedDevice) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Choose Preview Device"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select a device size to preview your form
          </p>

          <div className="grid gap-4">
            <button
              onClick={() => handleDeviceSelect("laptop")}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Monitor className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Laptop
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Desktop and laptop screens
                </p>
              </div>
            </button>

            <button
              onClick={() => handleDeviceSelect("tablet")}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Tablet className="w-8 h-8 text-purple-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Tablet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  iPad and tablet devices
                </p>
              </div>
            </button>

            <button
              onClick={() => handleDeviceSelect("mobile")}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Smartphone className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Mobile
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  iPhone and mobile devices
                </p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const deviceConfig = getDeviceContainer(selectedDevice);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Form Preview - ${
        selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)
      }`}
      size="2xl"
    >
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          ← Back to device selection
        </button>

        {/* Device Preview Container - FIXED */}
        <div className="flex justify-center items-center min-h-[600px] bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 overflow-hidden">
          <div
            className={`transform ${deviceConfig.scale} transition-transform duration-300`}
          >
            <div className={deviceConfig.containerClass}>
              <div className={deviceConfig.frameClass}>
                <div className={deviceConfig.screenClass}>
                  <FormPreview mode="preview" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedDevice === "mobile" &&
              "375 × 667 pixels (iPhone SE) - Scaled for preview"}
            {selectedDevice === "tablet" &&
              "768 × 1024 pixels (iPad) - Scaled for preview"}
            {selectedDevice === "laptop" &&
              "1200 × 700 pixels (Laptop) - Scaled for preview"}
          </p>
        </div>
      </div>
    </Modal>
  );
}
