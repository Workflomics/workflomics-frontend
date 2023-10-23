import React from 'react';
import { observer } from 'mobx-react-lite';

export interface TooltipData {
  text: string,
  top: number,
  left: number
}

interface WorkflowVisTooltipProps {
  tooltipData: TooltipData | null;
}

/** Tooltip widget for the WorkflowVisualization */
const WorkflowVisTooltip: React.FC<WorkflowVisTooltipProps> = observer(({ tooltipData }) => {
  return (
    <div className="tooltip" style={{
      top: tooltipData ? `${tooltipData.top}px` : 0,
      left: tooltipData ? `${tooltipData.left}px` : 0,
      visibility: tooltipData ? 'visible' : 'hidden'}}>
      { tooltipData ? tooltipData.text : ''}
    </div>
  );
});

export default WorkflowVisTooltip;
