import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, ExternalLink, FileDown } from 'lucide-react';
import { useAPI } from '../services/api';

const ChronicleCard = ({ date, title, content, pdfUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { media } = useAPI();

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">{date}</span>
        </div>
        {pdfUrl && (
          <a
            href={media.getMediaUrl(pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            <span className="text-sm">PDF</span>
          </a>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="relative">
        <div className={`transition-all duration-300 ${!isExpanded ? 'max-h-32' : 'max-h-[1000px]'} overflow-hidden`}>
          <p className="text-gray-300 leading-relaxed">{content}</p>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1729]/90 to-transparent" />
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          {isExpanded ? (
            <>Ler menos <ChevronDown className="w-4 h-4" /></>
          ) : (
            <>Ler mais <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
        {pdfUrl && isExpanded && (
          <a
            href={media.getMediaUrl(pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span className="text-sm">Versão completa</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ChronicleCard;