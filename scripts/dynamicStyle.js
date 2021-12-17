//== Helper functions
function styleElements(element, styleObj) {
   if (JSON.stringify(styleObj) !== "{}") {
      for (styleProperty in styleObj) {
         element.style[styleProperty] = styleObj[styleProperty];
      }
   }
}
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
   styleElements(element, styleObj);
   
   return element;
}

//== Initial style of static elements
function initialStyle() {                            
   const headerAndForm = document.querySelector("header");
   const main = document.querySelector("main");
   const mainTitle = document.querySelector("h1");
   const inputs = document.querySelectorAll("input");
   const formLabel = document.querySelector("label");

   styleElements(document.body, {
      display : "grid",
      gridTemplateColumns : "repeat(12, 1fr)",
      justifyContent : "center",
      justifyItems : "center",
      backgroundColor : "#ddddff"
   });
   styleElements(mainTitle, {
      fontFamily : "Marck Script",
      fontFamily : "Marck Script",
      fontSize : "120px",
      margin : "5px"
   });
   styleElements(formLabel, { fontSize : "20px" });
   styleElements(headerAndForm, {
      gridColumn : "1 /span 12",
      textAlign : "center",
   });
   for (element of inputs) {
      styleElements(element, {
         padding : "15px",
         fontSize : "20px"
      });
   } 
   styleElements(main, {
      gridColumn : "1 /span 12",
      display : "flex",
      flexWrap : "wrap",
      flexDirection : "row",
      justifyContent : "space-evenly",
      textAlign : "center"
   });
}