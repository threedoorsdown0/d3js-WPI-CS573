//   import { feature } from 'topojson';

const svg = d3.select("svg");

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append("g");

g.append("path")
  .attr("class", "sphere")
  .attr("d", pathGenerator({ type: "Sphere" }));

svg.call(
  d3.zoom().on("zoom", () => {
    g.attr("transform", d3.event.transform);
  })
);

Promise.all([
  d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
  d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
]).then(([tsvData, topoJSONdata]) => {
  const countryName = tsvData.reduce((accumulator, d) => {
    accumulator[d.iso_n3] = d.name;
    return accumulator;
  }, {});

  const countryPop = {};
  tsvData.forEach(d => {
    countryPop[d.iso_n3] = d3.format(".4s")(d.pop_est);
  });

  /*
    const countryName = {};
    tsvData.forEach(d => {
      countryName[d.iso_n3] = d.name;
    });
    */

  const countries = topojson.feature(
    topoJSONdata,
    topoJSONdata.objects.countries
  );

  g.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .append("title")
    .text(function(d) {
      return countryName[d.id] + "\nPop.: " + countryPop[d.id];
    })
    .on("click", function(d, i) {
      d3.selectAll(".country").classed("country-on", false);
      d3.select(".country").classed("country-on", true);
      console.log("Hello");
    });
});
