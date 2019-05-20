window.onload = main;
var dataset;
var maleNames = new Map(); //all male names with key = name, value = array of objects with {count,year}
var femaleNames = new Map(); //all female names with key = name, value = array of objects with {count,year}
var sortedMaleCount = new Map(); //all male names summed and sorted by count over all years
var sortedFemaleCount = new Map(); //all female names summed and sorted by count over all years
var top50Males = [];  // top 50 male names based on summed counts over all years
var top50Females = []; // top 50 female names based on summed counts over all years

var clicked = false;
var currLine;
var focus;
var filters = false;

var mouseLine;

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
  if(filters === false){
    baseVisual();
  }
}

function baseVisual(){
  var svg = d3.select("#viz"),
      width = +svg.attr("width") - margins.left - margins.right,
      height = +svg.attr("height") - margins.top - margins.bottom,
      g = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")"),
      focus = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")");

  svg.append("path")
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

  var xScale = d3.scaleTime()
                 .domain([new Date(1910,0,1),new Date(2016,0,1)])
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
               .x(function(d) { return xScale(new Date(parseInt(d.year),0,1))})
               .y(function(d) { return yScale(parseInt(d.count)); });
  focus = svg.append("g");
  var mPath;
  var fPath;
  for(var i = 0;i < 25; i++){
    var currM = top50Males[i];
    var currF = top50Females[i];
    var mData = maleNames.get(currM);
    var fData = femaleNames.get(currF);
    mPath = g.append("path")
      .datum(mData)
      .attr("class", "maleLine")
      .attr("id",currM)
      .attr("d", line)
      .on("mouseover",mouseover)
      .on("mouseout",mouseout)
      .on("click",mouseclick)
      .on("mousemove",mousemove);
    fPath = g.append("path")
      .datum(fData)
      .attr("class", "femaleLine")
      .attr("id",currF)
      .attr("d", line)
      .on("mouseover",mouseover)
      .on("mouseout",mouseout)
      .on("click",mouseclick)
      .on("mousemove",mousemove);
  }
}

function mouseover(d,i){
  var xScale = d3.scaleTime()
                 .domain([new Date(1910,0,1),new Date(2016,0,1)])
                 .rangeRound([0,900]);
  var yScale = d3.scaleLinear()
                 .domain([50,100000])
                 .rangeRound([550,0]);
  var name = d3.select(this).attr("id");
  var point = d3.mouse(this);
  var header = d3.select("#currentName");
  var year = xScale.invert(point[0]).getYear() + 1900;
  var count;

  d3.selectAll(".maleLine").style("stroke","gray").style("opacity","0.3").style("stroke-width","1px");
  d3.selectAll(".femaleLine").style("stroke","gray").style("opacity","0.3").style("stroke-width","1px");
  if(currLine){
    var currName = d3.select(currLine).attr("id");
    if(d3.select(currLine).attr("class") === "maleLine"){
      var currLineArr = maleNames.get(currName);
      for(var i = 0; i < currLineArr.length; i++){
        if(year == currLineArr[i].year){
           count = currLineArr[i].count;
        }
      }
      if(!count){
        count = 50;
      }
      var legend = currName + "  (Year:" + year + " Instances: " + count + ")";
      d3.select(currLine).style("stroke","blue").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","blue");
    }else{
      var currLineArr = femaleNames.get(currName);
      for(var i = 0; i < currLineArr.length; i++){
        if(year == currLineArr[i].year){
           count = currLineArr[i].count;
        }
      }
      if(!count){
        count = 50;
      }
      var legend = currName + "  (Year:" + year + " Instances: " + count + ")";
      d3.select(currLine).style("stroke","pink").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","pink");
    }
  }else{
    for(var i = 0; i < d.length; i++){
      if(year == d[i].year){
         count = d[i].count;
      }
    }
    if(!count){
      count = 50;
    }
    var legend = name + "  (Year:" + year + " Instances: " + count + ")";
    if(d3.select(this).attr("class") === "maleLine"){
      d3.select(this).style("stroke","blue").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","blue");
    }else{
      d3.select(this).style("stroke","pink").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","pink");
    }
  }
}

function mouseout(d,i){
  if(!clicked){
    d3.select("#currentName").text("");
    d3.selectAll(".maleLine").style("stroke","blue").style("opacity","1").style("stroke-width","2px");
    d3.selectAll(".femaleLine").style("stroke","pink").style("opacity","1").style("stroke-width","2px");
  }
}

function mouseclick(d,i){
  clicked = !clicked;
  if(clicked){
    currLine = this;
    d3.select(".mouse-line").style("opacity", "1");
  }else{
    d3.select("#currentName").text("");
    currLine = null;
    d3.select(".mouse-line").style("opacity", "0");
  }
}

function mousemove(d,i){
  var xScale = d3.scaleTime()
                 .domain([new Date(1910,0,1),new Date(2016,0,1)])
                 .rangeRound([0,900]);
  var yScale = d3.scaleLinear()
                 .domain([50,100000])
                 .rangeRound([550,0]);
  var point = d3.mouse(this);
  var header = d3.select("#currentName");
  var year = xScale.invert(point[0]).getYear() + 1900;
  var count;

  d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + (point[0] + 39) + "," + 570;
        d += " " + (point[0] + 39) + "," + 0;
        return d;
      });

  if(clicked && currLine){
    var currName = d3.select(currLine).attr("id");
    if(d3.select(currLine).attr("class") === "maleLine"){
      var currLineArr = maleNames.get(currName);
      for(var i = 0; i < currLineArr.length; i++){
        if(year == currLineArr[i].year){
           count = currLineArr[i].count;
        }
      }
      if(!count){
        count = 50;
      }
      var legend = currName + "  (Year:" + year + " Instances: " + count + ")";
      d3.select(currLine).style("stroke","blue").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","blue");
    }else{
      var currLineArr = femaleNames.get(currName);
      for(var i = 0; i < currLineArr.length; i++){
        if(year == currLineArr[i].year){
           count = currLineArr[i].count;
        }
      }
      if(!count){
        count = 50;
      }
      var legend = currName + "  (Year:" + year + " Instances: " + count + ")";
      d3.select(currLine).style("stroke","pink").style("opacity","1").style("stroke-width","5px");
      header.text(legend).style("color","pink");
    }
  }else{

  }
}
