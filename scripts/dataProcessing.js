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

//== Sec processing function that display data
function displayData(data) {              
   let day = 0;
   for (let obj in data) {
      const currentDay = `fcst_day_${day}`;
      
      const hoursContainer = createAndStyleElements("section", "", [], {});
      const dayContainer = createAndStyleElements("article", "", [], {
         margin: "25px",
         padding: "5px",
         border: "1px solid black"
      });

      const {
         day_long,
         tmp,
         tmin,
         tmax,
         condition,
         icon_big
      } = data[obj];
      
      const jourP = createAndStyleElements("h2", `${day_long}`, {
         fontSize : "50px",
         fontFamily : "Marck Script",
         margin : "15px 0px 15px 0px"
      });
      const conditionP = createAndStyleElements("p", `Condition météorologiques : ${condition}`, [], {});
      const tempP = createAndStyleElements("p", "", [], {});
      const tminP = createAndStyleElements("p", `Température minimale : ${tmin}°C`, [], {});
      const tmaxP = createAndStyleElements("p", `Température maximale : ${tmax}°C`, [], {});
      const iconP = createAndStyleElements("img", "", [["src", icon_big]], {});

      dynamicElementsContainer.appendChild(dayContainer);
      dayContainer.appendChild(jourP);
      dayContainer.appendChild(iconP);
      if (day === 0) {                                            // <today only data>
         jourP.textContent = `Aujourd'hui`;         
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
         
         const individualHoursContainer = createAndStyleElements("div", "", [], {});
         const hoursDataTitle = createAndStyleElements("span", `${currentHour} : `, [], {});
         const hoursDataCondition = createAndStyleElements("span", `${CONDITION}`, [], {});
         const hoursDataIcon = createAndStyleElements("img", "", [["src", ICON]], {
            display: "inline"
         });
                  
         dayContainer.appendChild(hoursContainer);
         hoursContainer.appendChild(individualHoursContainer);
         individualHoursContainer.appendChild(hoursDataTitle);
         individualHoursContainer.appendChild(hoursDataIcon);
         individualHoursContainer.appendChild(hoursDataCondition);
      }
      day++;
   }
   return 1;
}