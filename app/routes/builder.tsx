import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import FieldPalette, { FieldPreview } from "~/components/ui/FieldPalette";
import FormCanvas from "~/components/ui/FormCanvas";
import BottomBar from "~/components/ui/BottomBar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useFormBuilderStore } from "~/stores/formBuilder";
import type { Field } from "~/stores/formBuilder";
import toast from "react-hot-toast";

function BuilderContent() {
  const { addFieldToSection, reorderFields, sections } = useFormBuilderStore();
  const [activeDragItem, setActiveDragItem] = useState<Field | null>(null);
  const [dragType, setDragType] = useState<"palette" | "field" | null>(null);

  // Configure sensors for drag events
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      console.log("🟢 DRAG START:", {
        activeId: active.id,
        activeData: active.data?.current,
        timestamp: new Date().toISOString(),
      });

      if (active && active.data?.current) {
        const { type, label, isPaletteItem } = active.data.current;

        console.log("🔍 Checking drag source:", { isPaletteItem, type, label });

        if (isPaletteItem === true && type && label) {
          // Dragging from palette
          console.log("📦 Dragging from palette:", { type, label });
          setDragType("palette");
          setActiveDragItem({
            id: nanoid(),
            type,
            label,
          });
        } else {
          // Dragging existing field for reordering
          console.log("🔄 Dragging existing field for reorder");
          setDragType("field");
          const field = findFieldById(active.id);
          if (field) {
            console.log("✅ Found field for reorder:", field);
            setActiveDragItem(field);
          } else {
            console.log("❌ Field not found for reorder:", active.id);
          }
        }
      } else {
        console.log("❌ No active data found");
      }
    },
    [sections]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      console.log("🔴 DRAG END:", {
        activeId: active?.id,
        overId: over?.id,
        overData: over?.data?.current,
        activeDragItem,
        dragType,
        timestamp: new Date().toISOString(),
      });

      if (!over || !activeDragItem) {
        setActiveDragItem(null);
        setDragType(null);
        return;
      }

      console.log("🔍 Drag type:", { dragType });

      if (dragType === "palette") {
        // Adding new field from palette to section
        console.log("➕ Adding field to section");

        let targetSectionId = over.id;

        // Check if it's a bottom drop zone
        if (over.data?.current?.isBottomDropZone) {
          targetSectionId = over.data.current.sectionId;
          console.log(
            "📍 Dropping in bottom zone of section:",
            targetSectionId
          );
        }

        // Verify the section exists
        const section = sections.find((s) => s.id === targetSectionId);
        console.log("🔍 Target section found:", section);

        if (section) {
          console.log("✅ Adding field to section:", targetSectionId);
          addFieldToSection(targetSectionId, activeDragItem);
        } else {
          console.log("❌ Target is not a valid section");
        }
      } else if (dragType === "field") {
        // Reordering existing fields within the same section
        console.log("🔄 Attempting field reorder");
        const activeField = findFieldById(active.id);

        if (activeField) {
          const activeSection = findSectionByFieldId(active.id);
          console.log("📍 Active field section:", activeSection?.id);

          if (activeSection) {
            // Check if we're dropping on another field in the same section
            const overField = findFieldById(over.id);
            console.log("📍 Over field:", overField?.id);

            if (overField) {
              const overSection = findSectionByFieldId(over.id);
              console.log("📍 Over field section:", overSection?.id);

              if (overSection && activeSection.id === overSection.id) {
                // Reordering within the same section
                const oldIndex = activeSection.fields.findIndex(
                  (field) => field.id === active.id
                );
                const newIndex = activeSection.fields.findIndex(
                  (field) => field.id === over.id
                );

                console.log("🔄 Reorder indices:", { oldIndex, newIndex });

                if (oldIndex !== newIndex && oldIndex >= 0 && newIndex >= 0) {
                  console.log("✅ Performing reorder");
                  reorderFields(activeSection.id, oldIndex, newIndex);
                } else {
                  console.log("❌ Invalid reorder indices");
                }
              } else {
                // Trying to drop field from one section to another
                console.log("❌ Fields not in same section - showing toast");
                toast.error(
                  "Fields can only be reordered within the same section",
                  {
                    duration: 3000,
                    icon: "🚫",
                  }
                );
              }
            } else {
              console.log("❌ Over target is not a field");
              console.log("❌ Fields not in same section - showing toast");
              toast.error(
                "Fields can only be reordered within the same section",
                {
                  duration: 3000,
                  icon: "🚫",
                }
              );
            }
          } else {
            console.log("❌ Active field section not found");
          }
        } else {
          console.log("❌ Active field not found");
        }
      }

      setActiveDragItem(null);
      setDragType(null);
    },
    [activeDragItem, dragType, addFieldToSection, reorderFields, sections]
  );

  // Helper functions
  const findFieldById = (fieldId: string): Field | null => {
    for (const section of sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
    return null;
  };

  const findSectionByFieldId = (fieldId: string) => {
    return sections.find((section) =>
      section.fields.some((field) => field.id === fieldId)
    );
  };

  // Debug: Log sections structure
  console.log(
    "📊 Current sections:",
    sections.map((s) => ({
      id: s.id,
      title: s.title,
      fieldCount: s.fields?.length || 0,
      fieldIds: s.fields?.map((f) => f.id) || [],
    }))
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

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}
