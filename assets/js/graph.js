// docs/assets/js/graph.js
(async function() {
  const container = document.getElementById('graph-container');
  const width = container.clientWidth;
  const height = width * 0.75;
  const radius = 10; // node radius

  const data = await d3.json('../assets/data/graph-data.json');
  
  const svg = d3.select(container)
    .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('responsive-svg', true);

  // group for zoom
  const zoomGroup = svg.append('g').attr('class', 'zoom-group');

  // forces
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    // gently pull nodes back to center
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05));

  // draw links
  const link = zoomGroup.append('g')
      .attr('stroke', '#999')
    .selectAll('line')
    .data(data.links)
    .enter().append('line')
      .attr('stroke-width', 2);

  // draw nodes
  const node = zoomGroup.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(data.nodes)
    .enter().append('circle')
      .attr('r', radius)
      .attr('fill', d => d.color || '#555')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

  // draw labels
  const labels = zoomGroup.append('g')
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
          .attr('x', d.x + radius + 5)
          .attr('y', d.y - radius - 5)
          .attr('dy', '.35em');
    } else {
      group.append('text')
          .text(d.id)
          .attr('x', d.x + radius + 5)
          .attr('y', d.y - radius - 5)
          .attr('dy', '.35em');
    }
  });

  // tick: update positions and clamp within bounds
  simulation.on('tick', () => {
    data.nodes.forEach(d => {
      d.x = Math.max(radius, Math.min(width - radius, d.x));
      d.y = Math.max(radius, Math.min(height - radius, d.y));
    });

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labels.selectAll('text')
      .attr('x', d => d.x + radius + 5)
      .attr('y', d => d.y - radius - 5);
  });

  // zoom behavior
  const zoomBehavior = d3.zoom()
    .scaleExtent([0.5, 3])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', ({transform}) => {
      zoomGroup.attr('transform', transform);
    });

  svg.call(zoomBehavior);

  // drag handlers
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
})();
