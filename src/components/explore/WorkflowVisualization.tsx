import React from 'react';
import { observer } from 'mobx-react-lite';
import { PanZoom } from 'react-easy-panzoom';
import { ReactSVG } from 'react-svg';

interface WorkflowVisualizationProps {
  svg: string;
  showTooltip: (event: React.MouseEvent, data:any) => void;
}

/** This component contains the pan-zoomable SVG representing the workflow. */
const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = observer(({ svg, showTooltip }) => {

  const handleCircleClick = () => {
    console.log('Circle clicked!');
  };
  
  return (<PanZoom zoomSpeed="0.25">
      <ReactSVG src={svg} 
        onClick={(event) => {
          console.log('wrapper onClick', event);
        }} 
        afterInjection={(svg:any) => {
          const nodes = svg.querySelectorAll('.node'); // Replace with your element ID
          for (const node of nodes) {
            node.addEventListener('click', handleCircleClick);
            node.addEventListener('mouseenter', (event: React.MouseEvent) => showTooltip(event, node));
            node.addEventListener('mouseout', (event: React.MouseEvent) => showTooltip(event, null));
          }
        }}/>
    </PanZoom>);
});

export default WorkflowVisualization;
