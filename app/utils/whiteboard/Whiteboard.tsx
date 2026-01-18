'use client'

import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function Whiteboard() {
  return (
    <div className="w-full h-[70vh]">
      <Tldraw />
    </div>
  )
}
