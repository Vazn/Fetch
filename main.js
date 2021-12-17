const dynamicElementsContainer = document.querySelector("main");
let hourlyDisplayed = false;

function dynamicDataEvents() {
   const form = document.querySelector("form");

   const hourlyTrigger = document.querySelector("input[type=button]");
   
   //== Main trigger
   form.addEventListener("submit", (e) => {
      e.preventDefault();
      dynamicElementsContainer.innerHTML = "";

      //== Build URL -> Fetch API -> Process data into an array of functions
      dataProcessing(getWantedData, displayData); 
   });  
   
   //== Hourly data trigger
   hourlyTrigger.addEventListener("click", (e) => {
      e.preventDefault();

      const sections = Array.from(document.querySelectorAll("section"));
      if (hourlyDisplayed == false) {
         for (let element of sections) {
            element.style.display = "block";
         }
         hourlyDisplayed = true;
      }
      else {
         for (let element of sections) {
            element.style.display = "none";
         }
         hourlyDisplayed = false;
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


