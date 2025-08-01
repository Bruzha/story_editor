'use client';
import React from 'react';
import './style.scss';
import Button from '../button/Button';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const visiblePageCount = 5;
  const showFirstAndLast = true;

  const getPageNumbers = () => {
    if (totalPages <= visiblePageCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pageNumbers: (number | string)[] = [];
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    const leftSiblingIndex = Math.max(currentPage - 2, firstPageIndex);
    const rightSiblingIndex = Math.min(currentPage + 2, lastPageIndex);

    const shouldShowLeftDots = leftSiblingIndex > firstPageIndex + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPageIndex - 1;

    if (showFirstAndLast) {
      pageNumbers.push(firstPageIndex);
    }

    if (shouldShowLeftDots && showFirstAndLast) {
      pageNumbers.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPageIndex && i !== lastPageIndex) {
        pageNumbers.push(i);
      }
    }

    if (shouldShowRightDots && showFirstAndLast) {
      pageNumbers.push('...');
    }

    if (showFirstAndLast) {
      pageNumbers.push(lastPageIndex);
    }

    return pageNumbers;
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination">
      <Button name="<" type="button" disabled={currentPage === 1} onClick={handlePrevClick} />
      <ul className="pagination__list">
        {getPageNumbers().map((pageNumber, index) => (
          <li key={index} className="pagination__item">
            {typeof pageNumber === 'number' ? (
              <div
                className={`pagination__link ${currentPage === pageNumber ? 'pagination__link--active' : ''}`}
                onClick={() => handlePageClick(pageNumber)}
              >
                {pageNumber}
              </div>
            ) : (
              <span>{pageNumber}</span>
            )}
          </li>
        ))}
      </ul>
      <Button name=">" type="button" disabled={currentPage === totalPages} onClick={handleNextClick} />
    </nav>
  );
};

export default Pagination;
