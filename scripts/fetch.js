//== Build url for the request //== Full Error handling ==//
function buildUrl() {
   const apiRoot = "https://www.prevision-meteo.ch/services/json/";
   const input = document.querySelector("#cityField").value;
   const url = `${apiRoot}${input}`;
   return url;
}
//== Fetch any API and return data //== Full Error handling ==//
async function fetchApi() {
   let response;
   let data;

   try {
      response = await fetch(buildUrl());
      if (response.ok) {
         try {
            data = await response.json();
            console.log(`API data : `, data);
            if (Object.keys(data)[0] === "errors") {  //== If response.json() returns an array of errors
               throw new Error("Parsing to JSON returned errors: ");
            }
            return data;
         } catch (e){
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