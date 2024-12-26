"use client"

import React, { useState } from 'react'
import QrScanner from '../../lib/react-qr-scanner';

interface BarcodeScannerProps {
  onScan: (data: string | null) => void
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [startScan, setStartScan] = useState(false)

  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data)
      setStartScan(false)
    }
  }

  const handleError = (err: any) => {
    console.error(err)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setStartScan(!startScan)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {startScan ? 'Stop Scan' : 'Start Scan'}
      </button>
      {startScan && (
        <div className="w-full max-w-md mx-auto">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  )
}
