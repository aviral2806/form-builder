import FieldPalette from "~/components/ui/FieldPalette";
import FormCanvas from "~/components/ui/FormCanvas";
import BottomBar from "~/components/ui/BottomBar";
import { useFormBuilderStore } from "~/stores/formBuilder";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import type { Field } from "~/stores/formBuilder";
import { FieldPreview } from "~/components/ui/FieldPalette";

export default function BuilderPage() {
  const { addFieldToSection } = useFormBuilderStore();
  const [activeDragItem, setActiveDragItem] = useState<Field | null>(null);

  // Configure sensors for drag events
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    console.log("Drag started:", active);
    if (active && active.data?.current) {
      const { type, label } = active.data.current;
      if (type && label) {
        setActiveDragItem({
          id: nanoid(),
          type,
          label,
        });
      }
    }
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      console.log("Drag ended:", { active, over });

      // Only proceed if we dropped over a valid target
      if (over && activeDragItem) {
        console.log("Adding field to section:", {
          field: activeDragItem,
          sectionId: over.id,
        });

        addFieldToSection(over.id, activeDragItem);
      }

      // Reset active drag item
      setActiveDragItem(null);
    },
    [activeDragItem, addFieldToSection]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen mb-0 flex-col overflow-y-clip">
        <div className="flex flex-1 overflow-hidden">
          <FieldPalette />
          <FormCanvas />
        </div>
        <BottomBar />
        {activeDragItem && (
          <DragOverlay>
            <div className="flex items-center gap-3 border rounded p-2 cursor-grab hover:bg-gray-200 dark:hover:bg-zinc-700 opacity-55">
              <div className="w-32">
                <FieldPreview type={activeDragItem.type} />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {activeDragItem.label}
              </span>
            </div>
          </DragOverlay>
        )}
      </div>
    </DndContext>
  );
}
