const dynamicElementsContainer = document.querySelector("main");

function dynamicDataEvent() {
   const submitButton = document.querySelector("#submit");

   submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      dynamicElementsContainer.innerHTML = "";
   
      //== Build URL -> Fetch API -> Process data into an array of functions
      dataProcessing(getWantedData, displayData); 
   });
}

//======================//=========================================//=========================//

(function main() {

   try {
      initialStyle();
      dynamicDataEvent();
   }
   catch (e) {
      throw new Error("Browser failed to load javascript files correctly : ", e)
   }
})();


