import React from "react"

export default function FlowDiagram() {
  return (
    <div className="text-white">
      <svg 
        width="300" 
        height="400" 
        viewBox="0 0 300 400" 
        className="text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* SOIL box */}
        <rect x="10" y="20" width="80" height="40" stroke="white" fill="none" />
        <text x="50" y="45" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">SOIL</text>
        
        {/* FLORA boxes */}
        <rect x="10" y="100" width="80" height="40" stroke="white" fill="none" />
        <text x="50" y="125" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">FLORA</text>
        
        <rect x="10" y="160" width="80" height="40" stroke="white" fill="none" />
        <text x="50" y="185" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">FLORA</text>
        
        {/* CUTTING boxes */}
        <rect x="120" y="140" width="80" height="40" stroke="white" fill="none" />
        <text x="160" y="165" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">CUTTING</text>
        
        <rect x="120" y="200" width="80" height="40" stroke="white" fill="none" />
        <text x="160" y="225" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">CUTTING</text>
        
        <rect x="120" y="260" width="80" height="40" stroke="white" fill="none" />
        <text x="160" y="285" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">CUTTING</text>
        
        {/* YOUR WORK box */}
        <rect x="230" y="200" width="80" height="40" stroke="white" fill="none" />
        <text x="270" y="225" textAnchor="middle" className="text-xs font-jetbrains-mono fill-white uppercase" fontSize="12">YOUR WORK</text>
        
        {/* Curved lines connecting boxes */}
        <path d="M 50 60 Q 30 70 50 100" stroke="white" fill="none" />
        <path d="M 50 60 Q 30 90 50 160" stroke="white" fill="none" />
        <path d="M 90 180 Q 105 190 120 200" stroke="white" fill="none" />
        <path d="M 90 180 Q 105 210 120 240" stroke="white" fill="none" />
        <path d="M 90 180 Q 105 230 120 260" stroke="white" fill="none" />
        <path d="M 200 220 Q 215 220 230 220" stroke="white" fill="none" />
      </svg>
    </div>
  )
}
