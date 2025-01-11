import React from 'react';
import ChronicleCard from './ChronicleCard';

const ChroniclesSection = ({ chronicles }) => (
  <section id="cronicas" className="py-20 px-4">
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
        Linha do Tempo
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chronicles.map((chronicle) => (
          <ChronicleCard
            key={chronicle.id}
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

export default ChroniclesSection;