import * as d3 from 'd3';

export const mapValueToColor = (value: number) => {
  const colorScale = d3.scaleQuantize<string>()
    .domain([-1, 1])
    .range(["#fc9d5a", "#ffb582", "#ffceab", "#ffe6d5", "#ffffff", "#d7f3d1", "#aee5a3", "#81d876", "#48c946"]);
  return colorScale(value);
}
