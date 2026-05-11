import React from 'react';
export interface ResourceItem {
    name: string;
    coord: [number, number];
    type: 'base' | 'factory' | 'warehouse';
    value: number;
    description: string;
    town: string;
}
declare const ResourceMap: React.FC;
export default ResourceMap;
