import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SortableTabItemProps } from '../../types';

export function SortableTab({
  tab,
  isActive,
  isRenaming,
  renamingTab,
  theme,
  rawColors,
  onTabClick,
  onTabDoubleClick,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onContextMenu,
}: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id,
    disabled: isRenaming,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    marginBottom: '-1px',
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isRenaming ? 'text' : isDragging ? 'grabbing' : 'grab',
  };

  const handleClick = () => {
    if (!isRenaming) {
      onTabClick(tab.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isRenaming) {
      const titleElement = e.currentTarget.querySelector('span');
      const initialWidth = titleElement ? titleElement.offsetWidth : 60;
      onTabDoubleClick(tab.id, tab.title, initialWidth);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isRenaming) {
      onContextMenu(tab, e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isRenaming ? {} : listeners)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      data-tab-id={tab.id}
      className={theme.combine(
        "relative flex items-center h-7 text-sm select-none",
        isActive ? theme.bg.secondary : "bg-transparent",
        isActive ? theme.text.primary : theme.text.secondary,
        isActive ? "font-medium" : "font-normal",
        `border ${theme.border.primary}`,
        isDragging && !isActive ? '' : 'border-l-transparent border-t-transparent',
        isDragging ? 'shadow-lg' : '',
        'px-3'
      )}
    >
      {isRenaming && renamingTab ? (
        <input
          type="text"
          value={renamingTab.title}
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value.length <= 24) {
              onRenameChange(e.target.value);
            }
          }}
          onBlur={onRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onRenameSubmit();
            } else if (e.key === 'Escape') {
              onRenameCancel();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          autoFocus
          className="bg-transparent border-none outline-none text-sm h-full p-0 m-0 cursor-text"
          style={{
            color: isActive ? rawColors.text.primary : rawColors.text.secondary,
            width: `calc(${renamingTab.initialWidth}px + 2ch)`,
            minWidth: `${renamingTab.initialWidth}px`
          }}
        />
      ) : (
        <span className="pointer-events-none">{tab.title}</span>
      )}
    </div>
  );
}
