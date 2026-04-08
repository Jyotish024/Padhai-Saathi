import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Keep the worker same-origin (Vite bundles it) to avoid cross-origin failures.
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export function PDFViewer({ fileUrl, currentPage, onDocumentLoadSuccess }) {
  const [pageHeight, setPageHeight] = useState(500);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevFileUrl, setPrevFileUrl] = useState(fileUrl);

  // Adjust state during render when fileUrl changes
  if (fileUrl !== prevFileUrl) {
    setIsLoading(true);
    setPrevFileUrl(fileUrl);
  }

  useEffect(() => {
    const handleResize = () => {
      // Calculate available remaining height to fit the screen without scrolling
      // TopBar ~ 64px, Controls ~ 80px, Padding ~ 64px = ~208, use 220 to be safe
      const availableHeight = window.innerHeight - 220;
      setPageHeight(Math.max(400, availableHeight));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div 
      className="flex-1 w-full flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950/50 p-4 md:p-8" 
      ref={containerRef}
    >
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-xl dark:shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <div className="w-48 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={(pdf) => {
            onDocumentLoadSuccess(pdf.numPages);
            setIsLoading(false);
          }}
          loading={null}
          error={
            <div className="p-8 text-center text-red-500">
              Failed to load PDF. Please make sure the file exists.
            </div>
          }
          className="flex flex-col items-center justify-center w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${fileUrl}-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full flex justify-center"
            >
              <Page
                pageNumber={currentPage}
                height={pageHeight}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page-container transition-all"
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>
    </div>
  );
}
