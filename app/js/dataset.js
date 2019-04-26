window.onload = main;

function main(){
  var modernFemale = new Map();
  var modernMale = new Map();
  var oldFemale = new Map();
  var oldMale = new Map();
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
      }
    );


}
