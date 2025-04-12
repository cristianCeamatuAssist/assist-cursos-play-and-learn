import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = [];
  
  // Logic to determine page numbers to display
  const maxPagesDisplayed = 5;
  let startPage: number;
  let endPage: number;

  if (totalPages <= maxPagesDisplayed) {
    // Show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // Calculate start and end pages for larger sets
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesDisplayed / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesDisplayed / 2) - 1;
    
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // Near the start
      startPage = 1;
      endPage = maxPagesDisplayed;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // Near the end
      startPage = totalPages - maxPagesDisplayed + 1;
      endPage = totalPages;
    } else {
      // In the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // Generate page numbers to display
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span> pages
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                currentPage === 1 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                aria-current={currentPage === number ? 'page' : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === number
                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                currentPage === totalPages 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 