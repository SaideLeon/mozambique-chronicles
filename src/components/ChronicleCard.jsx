import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, ExternalLink, FileDown } from 'lucide-react';
import { useAPI } from '../services/api';
import SocialInteractions from './SocialInteractions';
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
  isDetail = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(isDetail);
  const handwritingStyle = {
    fontFamily: "'Caveat', cursive"
  };

  const { media } = useAPI();

  const toggleExpand = () => {
    if (!isDetail) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={cn(
      "rounded-xl transition-all duration-300 backdrop-blur-sm border",
      isDetail 
        ? "bg-white/10 border-purple-500/30" 
        : "bg-white/5 border-white/10",
      isDetail ? "h-[calc(100vh-8rem)]" : "min-h-[200px]",
      "flex flex-col relative overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex flex-row items-center justify-between shrink-0",
        isDetail ? "p-8 pb-4" : "p-6 pb-3"
      )}>
        <div className="flex items-center gap-3">
          <Calendar className={cn(
            "text-purple-400",
            isDetail ? "w-6 h-6" : "w-5 h-5"
          )} />
          <span className={cn(
            "font-medium tracking-wide text-purple-400",
            isDetail ? "text-base" : "text-sm"
          )}>{date}</span>
        </div>
        {pdfUrl && (
          <button
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-lg transition-all",
              "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10",
              isDetail ? "text-base" : "text-sm"
            )}
            onClick={() => window.open(media.getMediaUrl(pdfUrl), '_blank')}
          >
            <FileDown className={cn(
              isDetail ? "w-6 h-6" : "w-5 h-5",
              "mr-2"
            )} />
            <span>PDF</span>
          </button>
        )}
      </div>
      {/*<div className="bg-sky-200">
      	

      {/* Title 
      <div className={cn(
        "shrink-0",
        isDetail ? "px-8" : "px-6"
      )}>
        <h3 className={cn(
          "font-bold tracking-tight text-white",
          isDetail ? "text-2xl" : "text-xl",
          "leading-tight"
        )}>{title}</h3>
      </div>

      {/* Content 
      <div className={cn(
        "flex-1 overflow-hidden",
        isDetail ? "px-8" : "px-6",
        "mt-4"
      )}>
        <div className={cn(
          "h-full relative",
          (isExpanded || isDetail) && "overflow-hidden"
        )}>
          <div className="transition-all duration-300 h-full">
            <div className={cn(
              "prose max-w-none h-full prose-invert",
              !isExpanded && !isDetail && "line-clamp-3",
              (isExpanded || isDetail) && "overflow-y-auto",
              isDetail && "prose-lg",
              "prose-p:leading-relaxed"
            )}>
              {content}
            </div>
          </div>
          
          {!isExpanded && !isDetail && content.length > 200 && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1729]/90 to-transparent pointer-events-none" />
          )}
        </div>
      </div>
            	
      </div>
      */}
      
      {/* Notebook */}
      <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-white" 
           style={{
             backgroundImage: `
               repeating-linear-gradient(
                 transparent,
                 transparent 23px,
                 #e5e5e5 23px,
                 #e5e5e5 24px
               )
             `,
             backgroundSize: '100% 26px',
             minHeight: isDetail ? '600px' : '300px'
           }}>
        
        {/* Linha vermelha da margem */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200" />
        
        {/* Title */}
        <div className={cn(
          "shrink-0",
          isDetail ? "px-12" : "px-10"
        )}>
          <h3 className={cn(
            "tracking-tight pt-4",
            isDetail ? "text-2xl" : "text-xl",
            "leading-tight"
          )}
          style={{
            ...handwritingStyle,
            color: '#000000'
          }}>
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-hidden",
          isDetail ? "px-22" : "px-10",
          "mt-4"
        )}>
          <div className={cn(
            "h-full relative",
            (isExpanded || isDetail) && "overflow-hidden"
          )}>
            <div className="transition-all duration-300 h-full">
              <div className={cn(
                "max-w-none h-full",
                !isExpanded && !isDetail && "line-clamp-3",
                (isExpanded || isDetail) && "overflow-y-auto",
                isDetail && "text-lg",
                "leading-relaxed"
              )}
              style={{
                ...handwritingStyle,
                color: '#0066cc',
                lineHeight: '28px'
              }}>
                {content}
              </div>
            </div>
            
            {!isExpanded && !isDetail && content.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Action Buttons */}
      <div className={cn(
        "shrink-0",
        isDetail ? "px-8" : "px-6",
        "mt-4"
      )}>
        <div className={cn(
          "flex items-center justify-between",
          isDetail ? "pt-4" : "pt-2"
        )}>
          {!isDetail && (
            <button
              onClick={toggleExpand}
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-lg transition-all",
                "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10",
                "text-sm font-medium"
              )}
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
          )}

          {pdfUrl && (isExpanded || isDetail) && (
            <button
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-lg transition-all",
                "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10",
                isDetail ? "text-base ml-auto" : "text-sm",
                "font-medium"
              )}
              onClick={() => window.open(media.getMediaUrl(pdfUrl), '_blank')}
            >
              <span className="mr-2">Versão completa</span>
              <ExternalLink className={cn(
                isDetail ? "w-5 h-5" : "w-4 h-4"
              )} />
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-6 pb-6 mt-4">
        <SocialInteractions 
          chronicleId={id}
          isFeatured={isFeatured}
        />
      </div>
    </div>
  );
};

export default ChronicleCard;