window.onload = main;
var dataset;
var maleNames = new Map(); //all male names with key = name, value = array of objects with {count,year}
var femaleNames = new Map(); //all female names with key = name, value = array of objects with {count,year}
var sortedMaleCount = new Map(); //all male names summed and sorted by count over all years
var sortedFemaleCount = new Map(); //all female names summed and sorted by count over all years
var top50Males = [];  // top 50 male names based on summed counts over all years
var top50Females = []; // top 50 female names based on summed counts over all years

var margins = {top: 20, right: 20, bottom: 30, left: 40};

function main(){

  d3.csv("http://localhost:8080/names.csv")
    .then(function(data) {
        dataset = data;
        countUp();
      }
    );
}

function countUp(){
  var totalMaleCount = new Map();
  var totalFemaleCount = new Map();
  dataset.forEach(function(entry){
    if(entry.gender === "M"){
      if(maleNames.has(entry.name)){
        var update = {year: entry.year, count: parseInt(entry.count)};
        maleNames.get(entry.name).push(update);
      }else{
        var first = {year: entry.year , count: parseInt(entry.count)};
        maleNames.set(entry.name,[first]);
      }
      if(totalMaleCount.has(entry.name)){
        var update = totalMaleCount.get(entry.name) + parseInt(entry.count);
        totalMaleCount.set(entry.name,update);
      }else{
        totalMaleCount.set(entry.name,parseInt(entry.count));
      }
    }else if(entry.gender === "F"){
      if(totalFemaleCount.has(entry.name)){
        var update = totalFemaleCount.get(entry.name) + parseInt(entry.count);
        totalFemaleCount.set(entry.name,update);
      }else{
        totalFemaleCount.set(entry.name,parseInt(entry.count));
      }
      if(femaleNames.has(entry.name)){
        var update = {year: entry.year, count: parseInt(entry.count)};
        femaleNames.get(entry.name).push(update);
      }else{
        var first = {year: entry.year , count: parseInt(entry.count)};
        femaleNames.set(entry.name,[first]);
      }
    }
  });
  // Sorting and establishing top 50 names over all years
  sortedMaleCount = new Map([...totalMaleCount.entries()].sort((a, b) => b[1] - a[1]));
  sortedFemaleCount = new Map([...totalFemaleCount.entries()].sort((a, b) => b[1] - a[1]));
  var males = sortedMaleCount.keys();
  var females = sortedFemaleCount.keys();
  for(var i = 0;i < 50;i++){
    var currM = males.next().value;
    var currF = females.next().value;
    top50Males.push(currM);
    top50Females.push(currF);
  }

  // Creating base visual with top50 list
  baseVisual();
}

function baseVisual(){
  var svg = d3.select("#viz"),
      width = +svg.attr("width") - margins.left - margins.right,
      height = +svg.attr("height") - margins.top - margins.bottom,
      g = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")"),
      focus = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")");

  var xScale = d3.scaleLinear()
                 .domain([1910,2016])
                 .rangeRound([0,900]);
  var yScale = d3.scaleLinear()
                 .domain([50,100000])
                 .rangeRound([550,0]);
  svg.append('g')
    .attr('id', 'xAxis')
    .attr('transform', "translate(40,570)")
    .call(d3.axisBottom(xScale));
  svg.append('g')
    .attr('id', 'yAxis')
    .attr('transform', "translate(40,20)")
    .call(d3.axisLeft(yScale));

  var line = d3.line()
               .x(function(d) { return xScale(parseInt(d.year)) })
               .y(function(d) { return yScale(parseInt(d.count)); });

  for(var i = 0;i < 50; i++){
    var currM = top50Males[i];
    var currF = top50Females[i];
    var mData = maleNames.get(currM);
    var fData = femaleNames.get(currF);
    g.append("path")
      .datum(mData)
      .attr("class", "maleLine")
      .attr("d", line);
    g.append("path")
      .datum(fData)
      .attr("class", "femaleLine")
      .attr("d", line);
  }
}
