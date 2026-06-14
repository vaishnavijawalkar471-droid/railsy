"use client";

import React, { useState, useEffect } from 'react';
import { AdvancedMap } from "@/components/ui/interactive-map";
import { useFleetStore } from "@/store/fleetStore";

export default function AdvancedRailwayMap() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [markers, setMarkers] = useState([
    {
      id: 1,
      position: [18.9220, 72.8347], // CSMT Mumbai
      color: 'blue',
      size: 'medium',
      popup: {
        title: 'Mumbai CSMT',
        content: 'Chhatrapati Shivaji Maharaj Terminus',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop'
      }
    },
    {
      id: 2,
      position: [18.5284, 73.8743], // Pune Junction
      color: 'green',
      size: 'medium',
      popup: {
        title: 'Pune Junction',
        content: 'Pune Railway Station'
      }
    },
    {
      id: 3,
      position: [18.7516, 73.4042], // Lonavala
      color: 'orange',
      size: 'small',
      popup: {
        title: 'Lonavala Station',
        content: 'Hill Station Stop'
      }
    }
  ]);

  const polylines = [
    {
      id: 1,
      positions: [
        [18.9220, 72.8347], // Mumbai
        [19.0180, 72.8436], // Dadar
        [19.1678, 73.0042], // Thane
        [19.2312, 73.1466], // Kalyan
        [18.7516, 73.4042], // Lonavala
        [18.5284, 73.8743], // Pune
      ],
      style: { color: '#000080', weight: 4 }, // Ashoka Chakra Blue
      popup: 'Mumbai - Pune Corridor'
    }
  ];

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/50 rounded-lg animate-pulse">
        <span className="text-muted-foreground">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border/50">
      <AdvancedMap
        center={[18.9220, 73.2000]} // Center between Mumbai and Pune
        zoom={9}
        markers={markers}
        polylines={polylines}
        enableClustering={true}
        enableSearch={true}
        enableControls={true}
        style={{ height: '100%', minHeight: '400px', width: '100%' }}
      />
    </div>
  );
}
