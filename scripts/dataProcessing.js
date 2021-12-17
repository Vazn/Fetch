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

//== First processing function that return only needed data
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
//== Second processing function that display data
function displayData(data) {       
   
   //== An array of options that filters displayed elements
   const formOptions = document.querySelectorAll('input[type=checkbox]'); 
   hourlyTrigger.style.display = "block";

   let day = 0;
   for (let obj in data) {
      const currentDay = `fcst_day_${day}`;
      const {
         day_long,
         tmp,
         tmin,
         tmax,
         condition,
         icon_big,
         wnd_dir,
         wnd_spd,
      } = data[obj];
      
      const hoursContainer = createAndStyleElements("section", "", [], {
         margin: "15px 0px 0px 0px",
         display: "none",
      });
      const dayContainer = createAndStyleElements("article", "", [], {
         display: "flex",
         alignItems: "center",
         flexDirection: "column",
         margin: "25px",
         padding: "5px 15px 15px 15px",
         border: "2px solid black",
      });

      const jourP = createAndStyleElements("h2", `${day_long}`, [], {
         fontSize: "50px",
         fontFamily: "Marck Script",
         margin: "15px 0px 15px 0px"
      });
      const iconP = createAndStyleElements("img", "", [["src", icon_big]], {
         width: "175px"
      });

      const dataStyle = {
         fontSize: "1.2rem",
         margin: "0px 0px 10px 0px", 
      }
      const conditionP = createAndStyleElements("p", `Condition météorologiques : ${condition}`, [], dataStyle);
      const tempP = createAndStyleElements("p", "", [], dataStyle);
      const tminP = createAndStyleElements("p", `Température minimale : ${tmin}°C`, [], dataStyle);
      const tmaxP = createAndStyleElements("p", `Température maximale : ${tmax}°C`, [], dataStyle);
      const windP = createAndStyleElements("p", `Vent : ${wnd_spd} km/h - ${wnd_dir}`, [], dataStyle);

      dynamicElementsContainer.appendChild(dayContainer);
      dayContainer.appendChild(jourP);
      dayContainer.appendChild(iconP);
      if (day === 0) {                                            // <today only data>
         jourP.textContent = `Aujourd'hui`;         
         tempP.textContent = `Température actuelle : ${tmp}°C`;
         dayContainer.appendChild(tempP);
         dayContainer.appendChild(windP);
      } else {
         dayContainer.appendChild(tminP);
         dayContainer.appendChild(tmaxP);
      }
      dayContainer.appendChild(conditionP);
      dayContainer.appendChild(hoursContainer);
      
      for (let j=0 ; j<24 ; j++) { 
         let currentHour = `${j}H00`;  
         const {  
            ICON,
            CONDITION,
            ISSNOW,
            PRMSL,               // HPA
            WNDDIRCARD10,      
         } = data[currentDay].hourly_data[currentHour];
         
         const individualHoursContainer = createAndStyleElements("div", "", [], {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "5px",
            margin: "0px 0px 10px 0px",
            padding: "5px",
            width: "200px",
            // backgroundColor: "#bbbbee"
            backgroundColor: "#eeeeff"
         });
         const hoursDataIcon = createAndStyleElements("img", "", [["src", ICON]], {
            display: "block",
            width: "75px",
            textAlign: "center"
         });

         const hoursTextStyle = {
            fontSize: "1.1rem",
            margin: "5px 0px 0px 0px"
         }
         const hoursDataTitle = createAndStyleElements("span", `${currentHour} : `, [], hoursTextStyle);
         const hoursDataCondition = createAndStyleElements("span", `${CONDITION}`, [], hoursTextStyle);
         const windDirection = createAndStyleElements("span", `Direction du vent : ${WNDDIRCARD10}`, [], hoursTextStyle);            
         const snowAmount = createAndStyleElements("span", `Neige : ${ISSNOW}`, [], hoursTextStyle);
         const atmPressure = createAndStyleElements("span", `Pression atmospherique : ${PRMSL}`, [], hoursTextStyle);

         hoursContainer.appendChild(individualHoursContainer);
         individualHoursContainer.appendChild(hoursDataIcon);
         individualHoursContainer.appendChild(hoursDataTitle);
         individualHoursContainer.appendChild(hoursDataCondition);
         if (formOptions[0].checked === true) individualHoursContainer.appendChild(windDirection);
         if (formOptions[1].checked === true) individualHoursContainer.appendChild(snowAmount);
         if (formOptions[2].checked === true) individualHoursContainer.appendChild(atmPressure);
      }
      day++;
   }
   return 1;
}

//== Helper functions
function createAndStyleElements(tag, textContent = "", attributes = [], styleObj = {}) {
   let element = document.createElement(tag);
   if (textContent !== "") {
      element.textContent = textContent;
   }
   if (attributes.length > 0) {
      for (let i=0 ; i<attributes.length ; i++) {
         element.setAttribute(attributes[i][0], attributes[i][1]);
      }
   }
   if (JSON.stringify(styleObj) !== "{}") {
      for (styleProperty in styleObj) {
         element.style[styleProperty] = styleObj[styleProperty];
      }
   }   
   return element;
}