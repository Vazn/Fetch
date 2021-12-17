const apiRoot = "https://www.prevision-meteo.ch/services/json/";
const dynamicElementsContainer = document.querySelector("main");
const submitButton = document.querySelector("#submit");

//== Build url for the request // Errors OK 
function buildUrl() {
      const input = document.querySelector("#cityField").value;
      const url = `${apiRoot}${input}`;
      return url;
}

//== Fetch any API and return data //== Full Error handling ? ==//
async function fetchApi() {
   let response;
   let data;

   try {
      response = await fetch(buildUrl());
      if (response.ok) {
         try {
            data = await response.json();
            if (Object.keys(data)[0] === "errors") {  //== If response.json() returns an array of errors
               throw new Error("Parsing to JSON returned errors: ");
            }
            return data;
         } catch (e) {
            console.error(`${e}\nErrors :`, data.errors);
            alert(data.errors[0].description);
            return {};
         }
      }
      else {
         throw new Error("Cannot communicate with the weather service !") //== Case when code is not 20X
      }
   } catch (e) {
      alert(e);
      console.error(`Weather API returned an error : code ${response.status}`);
      return {};
   } 
}

//== Throw result data in a pipeline of functions :))
async function dataProcessing(...fn) {

   const data = await fetchApi();
   const pipe = (x) => (...functions) => functions.reduce((v, f) => f(v), x);

   try {
      if (JSON.stringify(data) === "{}") {  //== If fetch returns an empty object
         throw new Error("API fetch failed / No data found !");
      }
   } catch (e){
      console.error(e);
      return 0;
   }

   try {
      pipe(data)(
         ...fn
      );
   } catch (e) {
      console.error(e);
      return 0;
   }

   return 1;
}  

//== Process data and pick only what we want
function getWantedData(data) {            

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
//== Display data
function displayData(data) {              //== TODO: Some refactor ?
   
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
      if (i === 0) {    
         jourP.textContent = `Aujourd'hui`;         // Filter <today only data>
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
//== Style
(function htmlAndSomeStyle() {                            
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

   //== Build URL -> Fetch API -> Process data into an array of functions
   dataProcessing(getWantedData, displayData); 
});