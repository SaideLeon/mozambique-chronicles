import React from 'react';

const NotebookPage = ({ title, content }) => {
  // Fonte que simula escrita à mão
  const handwritingStyle = {
    fontFamily: "'Caveat', cursive"
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 shadow-lg">
      {/* Background com linhas do caderno */}
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
             backgroundSize: '100% 24px',
             minHeight: '500px',
             padding: '0 40px'
           }}>
        
        {/* Linha vermelha da margem */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200" />
        
        {/* Título */}
        <div className="mb-6 pt-4">
          <h1 
            className="text-2xl font-normal"
            style={{
              ...handwritingStyle,
              color: '#000000'
            }}>
            {title}
          </h1>
        </div>
        
        {/* Conteúdo */}
        <div 
          className="text-lg font-normal whitespace-pre-line"
          style={{
            ...handwritingStyle,
            color: '#0066cc',
            lineHeight: '24px'
          }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;