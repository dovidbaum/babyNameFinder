window.onload = main;
var dataset;
var sortedMaleCount = new Map();
var sortedFemaleCount = new Map();

function main(){

  d3.csv("http://localhost:8080/names.csv")
    .then(function(data) {
        dataset = data;
        countUp();
        baseVisual();
      }
    );
}

function countUp(){
  var totalMaleCount = new Map();
  var totalFemaleCount = new Map();
  dataset.forEach(function(entry){
    if(entry.gender === "M"){
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
    }
  });
  console.log(totalMaleCount);
  console.log(totalFemaleCount);
}

function baseVisual(){

}
