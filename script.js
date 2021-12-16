const dynamicElementsContainer = document.querySelector("main");
const submitButton = document.querySelector("#submit");

//== Request the API and pipe any number of functions to the resulting data
async function requestApi(...fn) {
   
   const pipe = (x) => (...functions) => functions.reduce((v, f) => f(v), x);

   const url = buildUrl(document.querySelector("#cityField").value);
   if (url === undefined) throw new Error("Unable to build the URL !");
   else {
      try {
         const response = await fetch(url);
         if (response.ok) {
            let data = await response.json();   
            pipe(data)(
               ...fn
            );

            return 1;
         }
         else {
            alert("Impossible de communiquer avec l'API !");
            throw new Error("Weather API returned an error !");
         }
      }
      catch (e) {
         alert("Rentrez une ville qui existe ou qui n'est pas un bled paumé de 150 habitants svp !")
         throw new Error("Can't fetch data from API", e);
      }
   }
}
//== Build url for the request
function buildUrl(str) {
   const url = "https://www.prevision-meteo.ch/services/json/";
   return `${url}${str}`;
}
function getWantedData(data) {            //== Fetch only wanted data and return them

   const wantedData = {};
   for (let str of Object.keys(data)) {
      const daysNb = Object.keys(wantedData).length
      
      if (str.includes("fcst_day") && daysNb < 4) { // Set a maximum nb of days
         wantedData[str] = data[str];
      }
   }
   wantedData.fcst_day_0.tmp = data.current_condition.tmp ;
   wantedData.fcst_day_0.hour = data.current_condition.hour ;
   wantedData.fcst_day_0.wnd_spd = data.current_condition.wnd_spd ;
   wantedData.fcst_day_0.wnd_dir = data.current_condition.wnd_dir ;
   
   return wantedData;
}
function displayData(data) {              //== TODO: Some refactor
   
   let i = 0;
   for (let obj in data) {
      const currentDay = `fcst_day_${i}`;
      const dayContainer = document.createElement("article");
      const hoursContainer = document.createElement("section");
      
      dayContainer.style.margin = "25px";
      dayContainer.style.padding = "5px";
      dayContainer.style.border = "1px solid black";
      
      const {
         day_long,
         tmp,
         tmin,
         tmax,
         condition,
         icon_big
      } = data[obj];
      
      const jourP = document.createElement("h2");
      const iconP = document.createElement("img");
      const conditionP = document.createElement("p");
      const tempP = document.createElement("p");
      const tminP = document.createElement("p");
      const tmaxP = document.createElement("p");
      
      iconP.setAttribute("src", icon_big);
      conditionP.textContent = `Condition météorologiques : ${condition}`;
      jourP.textContent = `${day_long}`;
      jourP.style.fontSize = "50px";
      jourP.style.fontFamily = "Marck Script";
      jourP.style.margin = "15px 0px 15px 0px";
      tminP.textContent = `Température minimale : ${tmin}°C`;
      tmaxP.textContent = `Température maximale : ${tmax}°C`;
      
      dynamicElementsContainer.appendChild(dayContainer);
      dayContainer.appendChild(jourP);
      dayContainer.appendChild(iconP);
      if (i === 0) {                                              // Filter <today only data>
         tempP.textContent = `Température actuelle : ${tmp}°C`;
         dayContainer.appendChild(tempP);
      }
      dayContainer.appendChild(tminP);
      dayContainer.appendChild(tmaxP);
      dayContainer.appendChild(conditionP);
      
      for (let j=0 ; j<24 ; j++) { 
         let currentHour = `${j}H00`;
         
         const {  
            ICON,
            CONDITION
         } = data[currentDay].hourly_data[currentHour];
         
         const individualHoursContainer = document.createElement("div");
         const hoursDataTitle = document.createElement("span");
         const hoursDataIcon = document.createElement("img");
         const hoursDataCondition = document.createElement("span");
         
         hoursDataTitle.textContent = `${currentHour} : `;
         hoursDataCondition.textContent = `${CONDITION}`;
         hoursDataIcon.style.display = "inline";
         hoursDataIcon.setAttribute("src", ICON);
         
         dayContainer.appendChild(hoursContainer);
         hoursContainer.appendChild(individualHoursContainer);
         individualHoursContainer.appendChild(hoursDataTitle);
         individualHoursContainer.appendChild(hoursDataIcon);
         individualHoursContainer.appendChild(hoursDataCondition);
      }
      i++;
   }
   return 1;
}
(function htmlAndSomeStyle() {                            //== Style
   const headerAndForm = document.querySelector("header");
   const main = document.querySelector("main");
   const mainTitle = document.querySelector("h1");
   const inputs = document.querySelectorAll("input");
   const formLabel = document.querySelector("label");
 
   document.body.style.display = "grid";
   document.body.style.gridTemplateColumns = "repeat(12, 1fr)";
   document.body.style.justifyContent = "center";
   document.body.style.justifyItems = "center";
   document.body.style.backgroundColor = "#ddddff";
   
   headerAndForm.style.gridColumn = "1 /span 12";
   headerAndForm.style.textAlign = "center";
   inputs[0].style.padding = "15px";
   inputs[0].style.fontSize = "20px";
   inputs[1].style.padding = "15px";
   inputs[1].style.fontSize = "20px";
   formLabel.style.fontSize = "20px";

   mainTitle.style.fontFamily = "Marck Script";
   mainTitle.style.fontFamily = "Marck Script";
   mainTitle.style.fontSize = "120px";
   mainTitle.style.margin = "5px";

   main.style.gridColumn = "1 /span 12";
   main.style.display = "flex";
   main.style.flexWrap = "wrap";
   main.style.flexDirection = "row";
   main.style.justifyContent = "space-evenly";
   main.style.textAlign = "center";
})();

submitButton.addEventListener("click", (e) => {
   e.preventDefault();
   dynamicElementsContainer.innerHTML = "";
   
   requestApi(getWantedData, displayData);
});