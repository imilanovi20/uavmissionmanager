
import { PageButton, PageInfo, PaginationContainer } from './Pagination.styles';
import type { PaginationProps } from './Pagination.types';

export const Pagination = (props: PaginationProps) => {
  if (props.totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PageButton key={1} onClick={() => props.onPageChange(1)}>
          1
        </PageButton>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          active={props.currentPage === i}
          onClick={() => props.onPageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    if (endPage < props.totalPages) {
      if (endPage < props.totalPages - 1) {
        pages.push(<span key="ellipsis2">...</span>);
      }
      pages.push(
        <PageButton key={props.totalPages} onClick={() => props.onPageChange(props.totalPages)}>
          {props.totalPages}
        </PageButton>
      );
    }

    return pages;
  };

  return (
    <PaginationContainer>
      <PageButton 
        onClick={props.onPrevious}
        disabled={props.currentPage === 1}
        title="Previous page"
      >
        ‹
      </PageButton>
      
      {renderPageNumbers()}
      
      <PageButton 
        onClick={props.onNext}
        disabled={props.currentPage === props.totalPages}
        title="Next page"
      >
        ›
      </PageButton>
      
      <PageInfo>
        Page {props.currentPage} of {props.totalPages}
      </PageInfo>
    </PaginationContainer>
  );
};