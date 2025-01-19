import React from 'react';
import ImprimirCard from './ImprimirCard';

const ImprimirSection = ({ chronicles }) => (
  <section id="cronicas" className="py-20 px-4">
    <div className="container mx-auto">
      <h2 className="text-3xl mt-32 md:text-4xl font-bold text-center text-white mb-12">
        Saíde Omar Saíde
      </h2>
      
      {/* Adjusted grid for better layout with expanded cards */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-full">
		{[...chronicles].reverse().map((chronicle) => (
		  <ImprimirCard
		    key={chronicle.id}
		    id={chronicle.id}
		    date={new Date(chronicle.date).toLocaleDateString('pt-BR', {
		      day: 'numeric',
		      month: 'long',
		      year: 'numeric',
		    })}
		    title={chronicle.title}
		    content={chronicle.content}
		    pdfUrl={chronicle.pdf_file}
		  />
		))}
      </div>
    </div>
  </section>
);

export default ImprimirSection;