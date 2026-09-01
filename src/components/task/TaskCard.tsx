/**
 * TaskCard — cartao de tarefa no Kanban
 * CP4: contrato do componente. Implementacao no CP5.
 */
import type { FC } from 'react';

export interface TaskCardProps {
  testID?: string;
}

export const TaskCard: FC<TaskCardProps> = () => {
  throw new Error('TaskCard sera implementado no CP5');
};

export default TaskCard;
