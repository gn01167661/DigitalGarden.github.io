// docs/assets/js/graph.js
(async function(){
  const width = 800, height = 600;
  const data = await d3.json('../assets/data/graph-data.json');

  const svg = d3.select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // 初始化力導向模擬
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));

  // 繪製連線
  const link = svg.append('g')
      .attr('stroke', '#999')
    .selectAll('line')
    .data(data.links)
    .enter().append('line')
      .attr('stroke-width', 2);

  // 繪製節點
  const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(data.nodes)
    .enter().append('circle')
      .attr('r', 10)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

  // 繪製標籤，若無 URL 則不包 <a>
  const labels = svg.append('g')
    .selectAll('g')
    .data(data.nodes)
    .enter().append('g');

  labels.each(function(d) {
    const group = d3.select(this);
    if (d.url) {
      group.append('a')
        .attr('href', d.url)
        .attr('target', '_blank')
        .style('cursor', 'pointer')
        .append('text')
          .text(d.id)
          .attr('x', d.x + 15)
          .attr('y', d.y - 10)
          .attr('dy', '.35em');
    } else {
      group.append('text')
        .text(d.id)
        .attr('x', d.x + 15)
        .attr('y', d.y - 10)
        .attr('dy', '.35em');
    }
  });

  // 更新位置
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labels.selectAll('text')
      .attr('x', d => d.x + 15)
      .attr('y', d => d.y - 10);
  });

  // 拖拽事件處理
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }
})();
