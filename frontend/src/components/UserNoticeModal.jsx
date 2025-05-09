import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function UserNoticeModal({ onClose }) {
  const { t, i18n } = useTranslation();
  const contentRef = useRef(null);
  const [canClose, setCanClose] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  const handleScroll = () => {
    const el = contentRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
      setCanClose(true);
    }
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const response = await fetch(`/src/assets/agreeTerms.${i18n.language}.md`);
        const content = await response.text();
        setMarkdownContent(content);
        
        // 检查内容高度
        setTimeout(() => {
          const el = contentRef.current;
          if (el && el.scrollHeight <= el.clientHeight + 2) {
            setCanClose(true);
          }
        }, 100);
      } catch (error) {
        console.error('Error loading markdown content:', error);
        setMarkdownContent('Error loading content');
      }
    };

    loadMarkdownContent();
  }, [i18n.language]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="w-[90%] max-w-[403px] bg-white rounded-2xl shadow-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 text-[#22457F]">{t('visitorNotice')}</h2>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto max-h-[60vh] border border-gray-200 rounded-lg p-4 mb-4 prose prose-sm max-w-none prose-headings:text-[#22457F] prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600"
          >
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
          <button
            className={`w-full py-2.5 rounded-lg transition-colors ${
              canClose 
                ? 'bg-[#22457F] text-white hover:bg-[#1A3666]' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
