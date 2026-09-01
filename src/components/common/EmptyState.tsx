/**
 * EmptyState — estado vazio ilustrado
 * CP4: contrato do componente. Implementacao no CP5.
 */
import type { FC } from 'react';

export interface EmptyStateProps {
  testID?: string;
}

export const EmptyState: FC<EmptyStateProps> = () => {
  throw new Error('EmptyState sera implementado no CP5');
};

export default EmptyState;
