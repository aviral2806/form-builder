import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { nanoid } from "nanoid";
import FieldPalette, { FieldPreview } from "~/components/ui/FieldPalette";
import FormCanvas from "~/components/ui/FormCanvas";
import BottomBar from "~/components/ui/BottomBar";
import ProtectedRoute from "~/components/ProtectedRoute";
import TemplateSelectionModal from "~/components/ui/TemplateSelectionModal";
import { useFormBuilderStore } from "~/stores/formBuilder";
import { FormTemplateService } from "~/services/templateService";
import type { Field } from "~/stores/formBuilder";
import toast from "react-hot-toast";

function BuilderContent() {
  const {
    addFieldToSection,
    reorderFields,
    sections,
    loadTemplate,
    resetForm,
    currentTemplateId,
    setCurrentTemplateId,
  } = useFormBuilderStore();

  const [searchParams] = useSearchParams();
  const editTemplateId = searchParams.get("edit");

  const [activeDragItem, setActiveDragItem] = useState<Field | null>(null);
  const [dragType, setDragType] = useState<"palette" | "field" | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(!editTemplateId); // Don't show modal if editing
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(!!editTemplateId);

  // Load template for editing
  useEffect(() => {
    const loadTemplateForEdit = async () => {
      if (editTemplateId) {
        try {
          setIsLoadingTemplate(true);
          const template = await FormTemplateService.getTemplateById(
            editTemplateId
          );

          if (template) {
            loadTemplate({
              formName: template.form_name,
              sections: template.form_structure,
              templateId: template.id,
            });
            toast.success(`Loaded "${template.form_name}" for editing`);
          } else {
            toast.error("Template not found");
            resetForm();
            setShowTemplateModal(true);
          }
        } catch (error) {
          console.error("Error loading template:", error);
          toast.error("Failed to load template");
          resetForm();
          setShowTemplateModal(true);
        } finally {
          setIsLoadingTemplate(false);
        }
      }
    };

    loadTemplateForEdit();
  }, [editTemplateId, loadTemplate, resetForm]);

  // Configure sensors for drag events
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    // For now, just start fresh
    resetForm();
    setShowTemplateModal(false);

    toast.success(`Template loading coming soon!`, {
      duration: 3000,
      icon: "✨",
    });
  };

  const handleStartFresh = () => {
    resetForm();
    setShowTemplateModal(false);

    toast.success("Starting with a blank form", {
      duration: 2000,
      icon: "📝",
    });
  };

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
          console.log("📦 Dragging from palette:", { type, label });
          setDragType("palette");
          setActiveDragItem({
            id: nanoid(),
            type,
            label,
            required: false,
            placeholder: "",
            options: [],
          });
        } else {
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

      if (!over || !activeDragItem) {
        setActiveDragItem(null);
        setDragType(null);
        return;
      }

      if (dragType === "palette") {
        let targetSectionId = over.id;

        if (over.data?.current?.isBottomDropZone) {
          targetSectionId = over.data.current.sectionId;
        }

        const section = sections.find((s) => s.id === targetSectionId);

        if (section) {
          addFieldToSection(targetSectionId, activeDragItem);
        }
      } else if (dragType === "field") {
        const activeField = findFieldById(active.id);

        if (activeField) {
          const activeSection = findSectionByFieldId(active.id);

          if (activeSection) {
            const overField = findFieldById(over.id);

            if (overField) {
              const overSection = findSectionByFieldId(over.id);

              if (overSection && activeSection.id === overSection.id) {
                const oldIndex = activeSection.fields.findIndex(
                  (field) => field.id === active.id
                );
                const newIndex = activeSection.fields.findIndex(
                  (field) => field.id === over.id
                );

                if (oldIndex !== newIndex && oldIndex >= 0 && newIndex >= 0) {
                  reorderFields(activeSection.id, oldIndex, newIndex);
                }
              } else {
                toast.error(
                  "Fields can only be reordered within the same section",
                  {
                    duration: 3000,
                    icon: "🚫",
                  }
                );
              }
            } else {
              toast.error(
                "Fields can only be reordered within the same section",
                {
                  duration: 3000,
                  icon: "🚫",
                }
              );
            }
          }
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

  // Show loading screen while loading template
  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading template...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
        onStartFresh={handleStartFresh}
      />

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
          <BottomBar
            isModalOpen={showTemplateModal}
            isEditMode={!!currentTemplateId}
          />
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
    </>
  );
}

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}
