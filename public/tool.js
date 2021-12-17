let optcontroller = document.querySelector(".options-cont");
let toolscontroller = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".notes");
let upload = document.querySelector(".upload");
let pencilFlag = false;
let eraserFlag = false;
let optionFlag = true;

//  Function for toggling the menu button  //
optcontroller.addEventListener("click", (e) => {
  // true -> show tools, false -> hide tools
  optionFlag = !optionFlag;

  if (optionFlag) {
    openTool();
  } else {
    closeTool();
  }
});
function openTool() {
  let iconElement = optcontroller.children[0];
  iconElement.classList.remove("fa-times");
  iconElement.classList.add("fa-bars");
  toolscontroller.style.display = "flex";
}
function closeTool() {
  let iconElement = optcontroller.children[0];
  iconElement.classList.remove("fa-bars");
  iconElement.classList.add("fa-times");

  toolscontroller.style.display = "none";
  pensilToolCont.style.display = "none";
}

// Function for the pencil tool //
pencil.addEventListener("click", (e) => {
  // true -> show pencil tool; false -> hide pencil tool;
  pencilFlag = !pencilFlag;
  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

// Function for the eraser tool //
eraser.addEventListener("click", (e) => {
  // true -> show eraser tool; false -> hide eraser tool;
  eraserFlag = !eraserFlag;
  if (eraserFlag) {
    eraserToolCont.style.display = "block";
  } else {
    eraserToolCont.style.display = "none";
  }
});

upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let TemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createTemplate(TemplateHTML);
    });
});


sticky.addEventListener("click", (e) => {
  let TemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
    createTemplate(TemplateHTML);
});

function createTemplate(TemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = TemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        drag_drop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") noteCont.style.display = "block";
    else {
      noteCont.style.display = "none";
    }
  });
}

function drag_drop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
