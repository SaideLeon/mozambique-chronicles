import React, { useState, useRef } from 'react';
import { Upload, Download } from 'lucide-react';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 80 });
  const [fontSize, setFontSize] = useState(48);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(80);
  const [shadowOffset, setShadowOffset] = useState(4);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [borderWidth, setBorderWidth] = useState(8);
  const [gradientHeight, setGradientHeight] = useState(100);
  const [gradientIntensity, setGradientIntensity] = useState(0.8);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          setImage(img);
          drawCanvas(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const getRGBAFromHex = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawGradientBackground = (ctx, x, y, text, width) => {
    const gradient = ctx.createLinearGradient(x, y - gradientHeight, x, y + gradientHeight/2);
    const color = getRGBAFromHex(shadowColor, shadowOpacity);
    
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, color);
    
    ctx.save();
    ctx.fillStyle = gradient;
    const textWidth = ctx.measureText(text).width;
    const padding = textWidth * 0.2;
    ctx.fillRect(x - textWidth/2 - padding, y - gradientHeight, textWidth + padding*2, gradientHeight*2);
    ctx.restore();
  };

  const drawTextWithEffects = (ctx, text, x, y) => {
    // Draw gradient background first
    drawGradientBackground(ctx, x, y, text, ctx.measureText(text).width);
    
    // Then draw text with shadow and border
    ctx.shadowColor = getRGBAFromHex(shadowColor, shadowOpacity);
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;
    
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeText(text, x, y);
    
    ctx.shadowColor = 'transparent';
    
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
  };

  const drawCanvas = (img = image) => {
    if (!canvasRef.current || !img) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';

    const maxWidth = canvas.width * 0.8;
    const x = textPosition.x / 100 * canvas.width;
    let y = textPosition.y / 100 * canvas.height;
    
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.2;
    
    y -= (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      drawTextWithEffects(ctx, line, x, y + index * lineHeight);
    });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    drawCanvas();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
            <Upload className="w-4 h-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!image}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto p-4 flex gap-4">
          <div className="flex-1 overflow-auto">
            <canvas
              ref={canvasRef}
              className="w-full border rounded shadow-lg"
            />
          </div>
          
          <div className="w-64 bg-white rounded-lg shadow-lg border flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium">Text Controls</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter text..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="96"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{fontSize}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shadow Color</label>
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => {
                      setShadowColor(e.target.value);
                      drawCanvas();
                    }}
                    className="w-full h-8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shadow Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowOpacity}
                    onChange={(e) => {
                      setShadowOpacity(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{shadowOpacity}%</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shadow Offset</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={shadowOffset}
                    onChange={(e) => {
                      setShadowOffset(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{shadowOffset}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shadow Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={shadowBlur}
                    onChange={(e) => {
                      setShadowBlur(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{shadowBlur}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Border Width</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={borderWidth}
                    onChange={(e) => {
                      setBorderWidth(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{borderWidth}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gradient Height</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={gradientHeight}
                    onChange={(e) => {
                      setGradientHeight(Number(e.target.value));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{gradientHeight}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gradient Intensity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={gradientIntensity * 100}
                    onChange={(e) => {
                      setGradientIntensity(Number(e.target.value) / 100);
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{Math.round(gradientIntensity * 100)}%</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Text Position X</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={textPosition.x}
                    onChange={(e) => {
                      setTextPosition(prev => ({ ...prev, x: Number(e.target.value) }));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{textPosition.x}%</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Text Position Y</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={textPosition.y}
                    onChange={(e) => {
                      setTextPosition(prev => ({ ...prev, y: Number(e.target.value) }));
                      drawCanvas();
                    }}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{textPosition.y}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;