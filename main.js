const dynamicElementsContainer = document.querySelector("main");
function dynamicDataEvents() {
   const form = document.querySelector("form");

   const hourlyTrigger = document.querySelector("input[type=button]");
   let hourlyTriggerClicked = true;
   
   //== Main trigger
   form.addEventListener("submit", (e) => {
      e.preventDefault();
      dynamicElementsContainer.innerHTML = "";
      hourlyTriggerClicked = true;
      
      //== Build URL -> Fetch API -> Process data into an array of functions
      dataProcessing(getWantedData, displayData); 
   });  
   //== Hourly data trigger
   hourlyTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      const sections = Array.from(document.querySelectorAll("section"));
      
      if (hourlyTriggerClicked == true) {
         for (let element of sections) {
            element.style.display = "block";
         }
         hourlyTriggerClicked = false;
      }
      else {
         for (let element of sections) {
            element.style.display = "none";
         }
         hourlyTriggerClicked = true;
      }
   })
}

//======================//=========================================//=========================//

(function main() {
   try {
      dynamicDataEvents();
   }
   catch (e) {
      throw new Error("Browser failed to load javascript files correctly : ", e)
   }
})();


