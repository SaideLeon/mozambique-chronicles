import React, { useState } from 'react';

const CURRENCY_CONFIG = {
  BRL: { symbol: 'R$', name: 'Real Brasileiro', locale: 'pt-BR' },
  EUR: { symbol: '€', name: 'Euro (Portugal)', locale: 'pt-PT' },
  AOA: { symbol: 'Kz', name: 'Kwanza Angolano', locale: 'pt-AO' },
  CVE: { symbol: '$', name: 'Escudo Cabo-verdiano', locale: 'pt-CV' },
  MZN: { symbol: 'MT', name: 'Metical Moçambicano', locale: 'pt-MZ' },
  STN: { symbol: 'Db', name: 'Dobra São-tomense', locale: 'pt-ST' }
};

const formatCurrency = (value, currency) => {
  const config = CURRENCY_CONFIG[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

const PriceCalculator = () => {
  // ... [Previous state declarations remain the same]
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  const [products, setProducts] = useState([]);
  const [costs, setCosts] = useState([]);
  const [profitMargin, setProfitMargin] = useState('');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: '',
    priceType: 'total',
    price: '',
    quantity: ''
  });
  
  const [costForm, setCostForm] = useState({
    description: '',
    value: ''
  });

  // ... [Previous handler functions remain the same]
  const handleAddProduct = (e) => {
    e.preventDefault();
    const { name, priceType, price, quantity } = productForm;
    
    if (!name || !price || !quantity) {
      alert('Por favor, preencha todos os campos do produto');
      return;
    }
    
    const numPrice = parseFloat(price);
    const numQuantity = parseInt(quantity);
    
    if (numPrice <= 0 || numQuantity <= 0) {
      alert('Preços e quantidades devem ser maiores que zero!');
      return;
    }
    
    const newProduct = {
      name,
      priceType,
      quantity: numQuantity,
      priceUnitario: priceType === 'total' ? numPrice / numQuantity : numPrice,
      custoTotal: priceType === 'total' ? numPrice : numPrice * numQuantity
    };
    
    setProducts([...products, newProduct]);
    setProductForm({ name: '', priceType: 'total', price: '', quantity: '' });
  };

  const handleAddCost = (e) => {
    e.preventDefault();
    const { description, value } = costForm;
    
    if (!description || !value) {
      alert('Por favor, preencha todos os campos do custo');
      return;
    }
    
    const numValue = parseFloat(value);
    if (numValue <= 0) {
      alert('O valor deve ser maior que zero!');
      return;
    }
    
    setCosts([...costs, { description, value: numValue }]);
    setCostForm({ description: '', value: '' });
  };

  const calculatePrices = () => {
    if (!products.length) {
      alert('Adicione pelo menos um produto!');
      return;
    }

    if (!costs.length) {
      alert('Adicione pelo menos um custo fixo!');
      return;
    }

    if (!profitMargin || parseFloat(profitMargin) <= 0) {
      alert('A margem de lucro deve ser maior que zero!');
      return;
    }
    
    const marginDecimal = parseFloat(profitMargin) / 100;
    const totalCustosProdutos = products.reduce((sum, p) => sum + p.custoTotal, 0);
    const totalCustosFixos = costs.reduce((sum, c) => sum + c.value, 0);
    
    const results = products.map(produto => {
      const custoFixoPorUnidade = totalCustosFixos / produto.quantity;
      const custoTotalUnitario = produto.priceUnitario + custoFixoPorUnidade;
      const precoVenda1 = custoTotalUnitario * (1 + marginDecimal);
      
      const custoTotal = produto.custoTotal + totalCustosFixos;
      const precoVenda2 = (custoTotal / produto.quantity) * (1 + marginDecimal);
      
      return {
        produto: produto.name,
        quantidade: produto.quantity,
        custoUnitarioBase: produto.priceUnitario,
        custoFixoPorUnidade,
        precoVendaSugerido1: precoVenda1,
        valorTotalVendas1: precoVenda1 * produto.quantity,
        lucroTotalEsperado1: (precoVenda1 * produto.quantity) - custoTotal,
        precoVendaSugerido2: precoVenda2,
        valorTotalVendas2: precoVenda2 * produto.quantity,
        lucroTotalEsperado2: (precoVenda2 * produto.quantity) - custoTotal,
        custoTotal
      };
    });
    
    setResults({
      custosFixos: totalCustosFixos,
      custosProdutos: totalCustosProdutos,
      detalhes: results
    });
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                Sistema de Cálculo de Preço
              </h1>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="p-2 bg-white/5 border border-white/20 rounded-lg text-white backdrop-blur-sm"
              >
                {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                  <option key={code} value={code} className="bg-blue-900 text-white">
                    {config.name} ({code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-8">
              {/* Product Form Section */}
              <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-blue-200 mb-4">Adicionar Produto</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={productForm.name}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <select
                    value={productForm.priceType}
                    onChange={e => setProductForm({...productForm, priceType: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  >
                    <option value="total" className="bg-blue-900">Preço Total</option>
                    <option value="unit" className="bg-blue-900">Preço Unitário</option>
                  </select>
                  <input
                    type="number"
                    placeholder={`Preço (${CURRENCY_CONFIG[selectedCurrency].symbol})`}
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={productForm.quantity}
                    onChange={e => setProductForm({...productForm, quantity: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <button 
                    type="submit" 
                    className="col-span-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
                  >
                    Adicionar Produto
                  </button>
                </form>
                
                {products.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-blue-200 mb-3">Produtos Cadastrados:</h4>
                    <div className="space-y-2">
                      {products.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-white">
                            {p.name} - {p.quantity} unidades a {formatCurrency(p.priceUnitario, selectedCurrency)}/un
                          </span>
                          <button
                            onClick={() => setProducts(products.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cost Form Section */}
              <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-medium text-blue-200 mb-4">Adicionar Custo Fixo</h3>
                <form onSubmit={handleAddCost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Descrição do custo"
                    value={costForm.description}
                    onChange={e => setCostForm({...costForm, description: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <input
                    type="number"
                    placeholder={`Valor (${CURRENCY_CONFIG[selectedCurrency].symbol})`}
                    value={costForm.value}
                    onChange={e => setCostForm({...costForm, value: e.target.value})}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <button 
                    type="submit" 
                    className="col-span-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                  >
                    Adicionar Custo
                  </button>
                </form>
                
                {costs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-blue-200 mb-3">Custos Cadastrados:</h4>
                    <div className="space-y-2">
                      {costs.map((c, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-white">
                            {c.description}: {formatCurrency(c.value, selectedCurrency)}
                          </span>
                          <button
                            onClick={() => setCosts(costs.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Calculation Section */}
              <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Margem de Lucro (%)"
                    value={profitMargin}
                    onChange={e => setProfitMargin(e.target.value)}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/70"
                  />
                  <button
                    onClick={calculatePrices}
                    disabled={!products.length || !costs.length}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                  >
                    Calcular Preços
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {showResults && results && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-medium text-blue-200">Resultados</h3>
                  
                  <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="text-white">
                      <p className="text-xl font-medium text-blue-200 mb-3">Resumo Geral:</p>
                      <p className="text-lg">Custos Fixos Totais: {formatCurrency(results.custosFixos, selectedCurrency)}</p>
                      <p className="text-lg">Custo Total Produtos: {formatCurrency(results.custosProdutos, selectedCurrency)}</p>
                    </div>
                  </div>
                  
                  {results.detalhes.map((r, i) => (
                    <div key={i} className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                      <h4 className="text-xl font-medium text-blue-200">{r.produto}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-2 text-white/90">
                          <p className="flex justify-between">
                            <span>Quantidade:</span>
                            <span className="font-medium">{r.quantidade} unidades</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Custo Unitário Base:</span>
                            <span className="font-medium">{formatCurrency(r.custoUnitarioBase, selectedCurrency)}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Custo Fixo por Unidade:</span>
                            <span className="font-medium">{formatCurrency(r.custoFixoPorUnidade, selectedCurrency)}</span>
                          </p>
                        </div>
                        
                        {/* Approach 1 */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                          <p className="text-lg font-medium text-blue-200 mb-3">Abordagem por Custo Unitário</p>
                          <div className="space-y-2 text-white/90">
                            <p className="flex justify-between">
                              <span>Preço de Venda:</span>
                              <span className="font-medium">{formatCurrency(r.precoVendaSugerido1, selectedCurrency)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Total de Vendas:</span>
                              <span className="font-medium">{formatCurrency(r.valorTotalVendas1, selectedCurrency)}</span>
                            </p>
                            <p className="flex justify-between text-emerald-300">
                              <span>Lucro Esperado:</span>
                              <span className="font-medium">{formatCurrency(r.lucroTotalEsperado1, selectedCurrency)}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Approach 2 */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 md:col-span-2">
                          <p className="text-lg font-medium text-blue-200 mb-3">Abordagem por Custo Total</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90">
                            <p className="flex justify-between md:block">
                              <span className="block mb-1">Preço de Venda:</span>
                              <span className="font-medium">{formatCurrency(r.precoVendaSugerido2, selectedCurrency)}</span>
                            </p>
                            <p className="flex justify-between md:block">
                              <span className="block mb-1">Total de Vendas:</span>
                              <span className="font-medium">{formatCurrency(r.valorTotalVendas2, selectedCurrency)}</span>
                            </p>
                            <p className="flex justify-between md:block text-emerald-300">
                              <span className="block mb-1">Lucro Esperado:</span>
                              <span className="font-medium">{formatCurrency(r.lucroTotalEsperado2, selectedCurrency)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;