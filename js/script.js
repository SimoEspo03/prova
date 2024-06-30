console.log('Script loaded');
document.addEventListener('DOMContentLoaded', function () {
   console.log('DOM fully loaded and parsed');

   fetch('data/data.json')
       .then(response => {
           console.log('Fetch response:', response);
           if (!response.ok) {
               throw new Error('Errore nel caricamento dei dati');
           }
           return response.json();
       })
       .then(data => {
           console.log('Data loaded:', data);

           const margin = { top: 20, right: 30, bottom: 40, left: 40 },
                 width = 800 - margin.left - margin.right,
                 height = 400 - margin.top - margin.bottom;

           const svg = d3.select("#chart")
                         .append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                         .attr("transform", `translate(${margin.left},${margin.top})`);

           console.log('SVG element created');

           const x = d3.scaleBand()
                       .domain(data.trees.map(d => d.name))
                       .range([0, width])
                       .padding(0.1);

           svg.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(x));

           console.log('X axis created');

           const y = d3.scaleLinear()
                       .domain([0, d3.max(data.trees, d => d.height)])
                       .nice()
                       .range([height, 0]);

           svg.append("g")
              .call(d3.axisLeft(y));

           console.log('Y axis created');

           svg.selectAll(".bar")
              .data(data.trees)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("x", d => x(d.name))
              .attr("y", d => y(d.height))
              .attr("width", x.bandwidth())
              .attr("height", d => height - y(d.height))
              .attr("fill", "steelblue");

           console.log('Bars created');
       })
       .catch(error => console.error('Errore nel caricamento dei dati:', error));
});
