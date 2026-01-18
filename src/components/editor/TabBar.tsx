import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useThemeRawColors } from '../../hooks/useThemeRawColors';
import { SortableTab } from './SortableTab';
import type { TabBarProps } from '../../types';

export function TabBar({
  tabs,
  activeTabId,
  renamingTab,
  onTabClick,
  onTabDoubleClick,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onAddTab,
  onReorderTabs,
  onContextMenu,
}: TabBarProps) {
  const theme = useThemeClasses();
  const rawColors = useThemeRawColors();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);
      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      onReorderTabs(newTabs.map((tab) => tab.id));
    }
  };

  return (
    <div className={theme.combine("flex items-center border-b", theme.border.primary)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {tabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              isActive={activeTabId === tab.id}
              isRenaming={renamingTab?.id === tab.id}
              renamingTab={renamingTab}
              theme={theme}
              rawColors={rawColors}
              onTabClick={onTabClick}
              onTabDoubleClick={onTabDoubleClick}
              onRenameChange={onRenameChange}
              onRenameSubmit={onRenameSubmit}
              onRenameCancel={onRenameCancel}
              onContextMenu={onContextMenu}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={onAddTab}
        className={theme.combine(
          "px-2 h-7 text-sm border-r border-b",
          theme.text.secondary,
          theme.border.primary,
          theme.bg.hover
        )}
        style={{ marginBottom: '-1px' }}
      >
        +
      </button>
    </div>
  );
}
