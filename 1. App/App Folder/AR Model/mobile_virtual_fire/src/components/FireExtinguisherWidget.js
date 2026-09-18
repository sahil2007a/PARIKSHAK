import React from 'react';
import ARExtinguisher3DLayer from './ARExtinguisher3DLayer';

export default function FireExtinguisherWidget({
  isExtinguishing = false,
  onToggleExtinguisher,
}) {
  return (
    <ARExtinguisher3DLayer
      isExtinguishing={isExtinguishing}
      onToggleExtinguisher={onToggleExtinguisher}
    />
  );
}
