import type { ReactNode } from "react";

export interface SelectableItem {
  id: number | string;
  imagePath?: string;
}

export interface SelectionModalProps<T extends SelectableItem> {
  title: string;
  items: T[];
  selectedIds: (number | string)[];
  onConfirm: (selectedIds: (number | string)[]) => void;
  onClose: () => void;
  renderCard: (item: T, isSelected: boolean) => ReactNode;
  renderPlaceholder?: () => ReactNode;
  itemsPerPage?: number;
  itemLabel?: string; 
}