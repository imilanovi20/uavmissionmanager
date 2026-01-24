import { X } from 'lucide-react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  ItemGrid,
  ItemCard,
  ItemImage,
  ItemImagePlaceholder,
  ItemContent,
  PaginationContainer,
  PaginationButton,
  PageInfo,
  SelectedCount,
  ActionButton
} from './SelectionModal.styles';
import type { SelectableItem, SelectionModalProps } from './SelectionModal.types';
import { useState } from 'react';



function SelectionModal<T extends SelectableItem>({
  title,
  items,
  selectedIds,
  onConfirm,
  onClose,
  renderCard,
  renderPlaceholder,
  itemsPerPage = 6,
  itemLabel = 'item'
}: SelectionModalProps<T>) {
  const [tempSelectedIds, setTempSelectedIds] = useState<(number | string)[]>(selectedIds);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const toggleItem = (itemId: number | string) => {
    setTempSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ItemGrid>
            {currentItems.map((item) => {
              const isSelected = tempSelectedIds.includes(item.id);
              
              return (
                <ItemCard
                  key={item.id}
                  selected={isSelected}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.imagePath && item.imagePath !== '' && item.imagePath !== '/' ? (
                    <ItemImage src={item.imagePath} alt={`${item.id}`} />
                  ) : (
                    <ItemImagePlaceholder>
                      {renderPlaceholder ? renderPlaceholder() : null}
                    </ItemImagePlaceholder>
                  )}

                  <ItemContent>
                    {renderCard(item, isSelected)}
                  </ItemContent>
                </ItemCard>
              );
            })}
          </ItemGrid>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>
              <PaginationButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </ModalBody>

        <ModalFooter>
          <SelectedCount>
            Selected: {tempSelectedIds.length} {itemLabel}(s)
          </SelectedCount>
          <ActionButton onClick={handleConfirm}>
            Confirm Selection
          </ActionButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SelectionModal;
