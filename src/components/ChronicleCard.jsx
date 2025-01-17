import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, ExternalLink, FileDown } from 'lucide-react';
import { useAPI } from '../services/api';
import SocialInteractions from './SocialInteractions';

// Utility function to concatenate class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const ChronicleCard = ({ 
  id,
  date, 
  title, 
  content, 
  pdfUrl,
  isFeatured = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { media } = useAPI();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
// alert("Chronicle ID: " + title);

  return (
    <div className={cn(
      "rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 overflow-hidden transition-all duration-300",
      isExpanded && "bg-white/10",
      className
    )}>
      {/* Header */}
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">{date}</span>
        </div>
        {pdfUrl && (
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-md transition-colors"
            onClick={() => window.open(media.getMediaUrl(pdfUrl), '_blank')}
          >
            <FileDown className="w-5 h-5 mr-2" />
            <span className="text-sm">PDF</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pt-0 space-y-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        
        <div className="relative">
          <div 
            className={cn(
              "transition-all duration-300",
              !isExpanded ? "max-h-32" : "max-h-[1000px]"
            )}
          >
            <div className={cn(
              "prose prose-invert max-w-none",
              !isExpanded && "line-clamp-3"
            )}>
              {content}
            </div>
          </div>
          
          {!isExpanded && content.length > 200 && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1729]/90 to-transparent" />
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={toggleExpand}
            className="inline-flex items-center px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-md transition-colors"
          >
            {isExpanded ? (
              <>
                Ler menos
                <ChevronDown className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Ler mais
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>

          {pdfUrl && isExpanded && (
            <button
              className="inline-flex items-center px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-md transition-colors"
              onClick={() => window.open(media.getMediaUrl(pdfUrl), '_blank')}
            >
              <span className="text-sm mr-2">Versão completa</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Footer */}

      <div className="px-6 pb-6">
        <SocialInteractions 
          chronicleId={id}
          isFeatured={isFeatured}
        />
      </div>
    </div>
  );
};

export default ChronicleCard;