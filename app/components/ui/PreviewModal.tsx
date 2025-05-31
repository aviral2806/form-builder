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
              disabled
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg opacity-50 cursor-not-allowed"
            >
              <Tablet className="w-8 h-8 text-gray-400" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Tablet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </button>

            <button
              onClick={() => handleDeviceSelect("mobile")}
              disabled
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg opacity-50 cursor-not-allowed"
            >
              <Smartphone className="w-8 h-8 text-gray-400" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Mobile
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Form Preview - ${
        selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)
      }`}
      size="lg"
    >
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          ← Back to device selection
        </button>

        <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <FormPreview device={selectedDevice} />
        </div>
      </div>
    </Modal>
  );
}
