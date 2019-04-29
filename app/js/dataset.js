window.onload = main;

window.onsubmit = advancedFilters;


function main(){
  var modernFemale = new Map();
  var modernMale = new Map();
  var totalModern = new Map();
  var oldFemale = new Map();
  var oldMale = new Map();
  var totalOld = new Map();

  d3.csv("http://localhost:8080/babyNames.csv")
    .then(function(data) {
        data.forEach(function(d) {
          if(d.Era === "Modern"){
            totalModern.set(d.Name,Number(d.Total));
            if(typeof d.F !== 'undefined'){
              modernFemale.set(d.Name,Number(d.F));
            }else{
              modernFemale.set(d.Name,0);
            }
            if(typeof d.M !== 'undefined'){
              modernMale.set(d.Name,Number(d.M));
            }else{
              modernMale.set(d.Name,0);
            }
          }else{
            totalOld.set(d.Name,d.Total);
            if(typeof d.F !== 'undefined'){
              oldFemale.set(d.Name,Number(d.F));
            }else{
              oldFemale.set(d.Name,0);
            }
            if(typeof d.M !== 'undefined'){
              oldMale.set(d.Name,Number(d.M));
            }else{
              oldMale.set(d.Name,0);
            }
          }

        })
        // Sorted by name count in descending order
        var sortedModernFemale = new Map([...modernFemale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedModernMale = new Map([...modernMale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedTotalModern = new Map([...totalModern.entries()].sort((a, b) => b[1] - a[1]));
        var sortedTotalOld = new Map([...totalOld.entries()].sort((a, b) => b[1] - a[1]));
        var sortedOldFemale = new Map([...oldFemale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedOldMale = new Map([...oldMale.entries()].sort((a, b) => b[1] - a[1]));
        // Populating Table with all rows of dataset
        var table = document.getElementById("bootstrap-data-table-export");

        var currRow = 1;
        var modernKeys = Array.from( sortedTotalModern.keys() );
        for(var i = 0; i < 500; i++){
          var currName = modernKeys[i];
          var newRow = table.insertRow(currRow);
          var cell1 = newRow.insertCell(0);
          var cell2 = newRow.insertCell(1);
          var cell3 = newRow.insertCell(2);
          var cell4 = newRow.insertCell(3);
          cell1.innerHTML = currName;
          cell2.innerHTML = modernFemale.get(currName);
          cell3.innerHTML = modernMale.get(currName);
          cell4.innerHTML = "Modern";

          currRow++;
        }

        var oldKeys = Array.from( sortedTotalOld.keys() );
        for(var i = 0; i < 500; i++){
          var currName = oldKeys[i];
          var newRow = table.insertRow(currRow);
          var cell1 = newRow.insertCell(0);
          var cell2 = newRow.insertCell(1);
          var cell3 = newRow.insertCell(2);
          var cell4 = newRow.insertCell(3);
          cell1.innerHTML = currName;
          cell2.innerHTML = oldFemale.get(currName);
          cell3.innerHTML = oldMale.get(currName);
          cell4.innerHTML = "Old";

          currRow++;
        }

      }
    );
}

function advancedFilters(){
  var modernFemale = new Map();
  var modernMale = new Map();
  var oldFemale = new Map();
  var oldMale = new Map();

  var genderChoice;
  if(document.getElementById("bothRadio").checked){
    genderChoice = "both";
  }else if(document.getElementById("boyRadio").checked){
    genderChoice = "M";
  }else if(document.getElementById("girlRadio").checked){
    genderChoice = "F";
  }

  var startWith = document.getElementById("start").value;
  var notStartWith = document.getElementById("not-start").value;
  var endWith = document.getElementById("end").value;
  var notEndWith = document.getElementById("not-end").value;

  d3.csv("http://localhost:8080/babyNames.csv")
    .then(function(data) {
        data.forEach(function(d) {
          if(d.F){
            if(d.Era === "Modern"){
              modernFemale.set(d.Name,d.F);
            }else if(d.Era === "Old"){
              oldFemale.set(d.Name,d.F);
            }
          }else if(d.M){
            if(d.Era === "Modern"){
              modernMale.set(d.Name,d.M);
            }else if(d.Era === "Old"){
              oldMale.set(d.Name,d.M);
            }
          }
        })
        // Sorted by name count in descending order
        var sortedModernFemale = new Map([...modernFemale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedModernMale = new Map([...modernMale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedOldFemale = new Map([...oldFemale.entries()].sort((a, b) => b[1] - a[1]));
        var sortedOldMale = new Map([...oldMale.entries()].sort((a, b) => b[1] - a[1]));

        // Populating Table with advanced filters
      }
    );
}
