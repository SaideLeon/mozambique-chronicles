import React from 'react';
import { Calendar, ExternalLink, FileDown } from 'lucide-react';
import { useAPI } from '../services/api';
import SocialInteractions from './SocialInteractions';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const ImprimirCard = ({ 
  id,
  date, 
  title, 
  content, 
  pdfUrl,
  isFeatured = false,
  className,
  dashboard = false,
}) => {
  const handwritingStyle = {
    fontFamily: "'Caveat', cursive"
  };

  const { media } = useAPI();

  return (
    <div className={cn(
      "rounded-xl transition-all duration-300 backdrop-blur-sm border",
      "bg-white/10 border-purple-500/30",
      "flex flex-col relative overflow-hidden max-w-full",
      className
    )}>
      
      {/* Notebook */}
      <div className="w-full max-w-full mx-auto">
        <div className="relative bg-white" 
             style={{
               backgroundImage: `
                 repeating-linear-gradient(
                   transparent,
                   transparent 31px,
                   #e5e5e5 31px,
                   #e5e5e5 32px
                 )
               `,
               backgroundSize: '100% 34px',
               minHeight: '600px'
             }}>
          
          {/* Title */}
          <div className="px-22 shrink-0 ml-11">
            <h3 className="text-4xl tracking-tight pt-4 leading-tight"
                style={{
                  ...handwritingStyle,
                  color: '#000000'
                }}>
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-3 mt-4 flex-1">
            <div className="h-full overflow-y-auto">
              <div className="text-4xl leading-relaxed ml-3"
                   style={{
                     ...handwritingStyle,
                     color: '#0066cc',
                     lineHeight: '50px'
                   }}>
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImprimirCard;