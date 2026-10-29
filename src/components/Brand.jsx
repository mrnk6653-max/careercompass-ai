import React from 'react'
import { Compass } from 'lucide-react'

export default function Brand({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><Compass size={20} strokeWidth={2.4} /></span><span>CareerCompass <b>AI</b></span></div>
}
