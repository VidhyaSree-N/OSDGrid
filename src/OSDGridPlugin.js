/*
 * GridViewerPlugin.js
 *
 * Plugin for OpenSeadragon that adds Grid on OSD image
 *
 * By Vidhya Sree N and Nicholas Verrochi
 * For CS410 - The Axolotl Project
 *
 * Requires OpenSeadragon Fabric.js,
 * and the OpenSeadragon Fabric.js Overlay plugin
 */

class OSDGridPlugin {
    /**
     * APIs used by the plugin
     */
    viewer; // the OpenSeadragon viewer
    overlay; // the fabric.js overlay, contains the canvas
    fabricCanvas; // the fabric.js canvas to draw shapes on
    useBuiltInUI; // when true, will setup the built-in UI after starting

    /**
     * Customization options
     */
    conversionFactor; // factor to multiply for converting from pixels
    menuOptions; // options object to be passed to the built-in UI if used
    units; // string to indicate what units are used, for example "mm"


   constructor(viewer,options = {}) {
    this.viewer = viewer;
    this.processOptions(options);
    this.overlay = viewer.fabricjsOverlay();
    this.fabricCanvas = this.overlay.fabricCanvas();
    this.gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false
    });

    // Bind the toggleGrid, rotateGrid, and changeGridSize functions to the current instance
     this.toggleGrid = this.toggleGrid.bind(this);
     this.rotateGrid = this.rotateGrid.bind(this);
     this.changeGridSize = this.changeGridSize.bind(this);

    // Add the plugin HTML to the viewer element
    this.addPluginHTML(viewer);
    this.addPluginCSS(viewer);

    this.addGrid(viewer);

    this.viewer.addHandler('page', () => {
      this.resetGridAndSlider();
    });
  }

  resetGridAndSlider() {
        const elements = ["grid-rotation-slider", "grid", "angle-display", "grid-rotation-label", "grid-size-label", "grid-size-slider", "grid-size-value"];
        elements.forEach(element => document.getElementById(element).style.display = "none");
        document.getElementById("grid").checked = false;
        document.getElementById("grid-rotation-slider").value = "0";
        document.getElementById("grid-size-slider").value = "440";
        this.gridGroup.setAngle(0);
        document.getElementById("angle-display").innerText = "";
        this.gridGroup.remove(...this.gridGroup.getObjects("line"));
    }
  /**
       * processOptions:
       *
       * Stores customization options in the object proper
       * Loads the built-in UI if chosen for use
       *
       * @param {Object} options
       */
      processOptions(options) {
          if (options.conversionFactor) {
              this.conversionFactor = options.conversionFactor;
          }
          else {
              this.conversionFactor = 1;
          }

          if (options.units) {
              this.units = options.units;
          }
          else {
              this.units = "px";
          }
      }


   // Function to toggle the grid
   toggleGrid() {
     var gridVisible = this.gridGroup.visible;
     this.gridGroup.visible = !gridVisible;
     this.fabricCanvas.renderAll();
     var gridRotationAngle = document.getElementById("grid-rotation-slider");
     var gridToggleSwitch = document.getElementById("grid");
     var angleDisplay = document.getElementById("angle-display");
     var gridRotationLabel = document.getElementById("grid-rotation-label");
     var gridSizeLabel = document.getElementById("grid-size-label");
     var gridSizeChange = document.getElementById("grid-size-slider");
     var gridSizeDisplay = document.getElementById("grid-size-value")
     if (gridVisible) {
       gridRotationAngle.style.display = "none";
       angleDisplay.style.display = "none"
       gridRotationLabel.style.display= "none";
       gridSizeLabel.style.display= "none";
       gridSizeChange.style.display= "none";
       gridSizeDisplay.style.display= "none";
       gridToggleSwitch.checked = false;
     } else {
       gridSizeLabel.style.display= "block";
       gridSizeChange.style.display= "block";
       gridRotationAngle.style.display = "block";
       angleDisplay.style.display = "block"
       gridRotationLabel.style.display= "block";
       gridSizeDisplay.style.display= "block";
       gridToggleSwitch.checked = true;
       gridRotationLabel.innerText = "Grid Rotation:"
       gridSizeLabel.innerText = "Grid Size:"
     }
   }

  changeGridSize() {
    const gridSizeSlider = document.getElementById("grid-size-slider");
    const gridSizeValue = document.getElementById("grid-size-value");
    const gridSize = parseInt(gridSizeSlider.value);
    // Convert the grid size to the desired unit
    const scaledGridSize = (gridSize * this.conversionFactor).toFixed(3);
    gridSizeValue.innerText = scaledGridSize + this.units;
    // Clear the existing grid lines
    this.gridGroup.remove(...this.gridGroup.getObjects("line"));

    var world = this.viewer.world;
    if (world) {
      var imageSize = world.getItemAt(0).getContentSize();
      var canvasWidth = imageSize.x;
      var canvasHeight = imageSize.y;

      // Calculate the diagonal length of the canvas to ensure grid lines extend beyond it
      var diagonalLength = Math.sqrt(canvasWidth ** 2 + canvasHeight ** 2);

      // Draw horizontal lines
      for (var i = -diagonalLength; i <= diagonalLength; i += gridSize) {
        var line = new fabric.Line(
          [-diagonalLength, i, diagonalLength, i],
          {
            stroke: "grey",
            strokeWidth: 5,
          }
        );
        this.gridGroup.add(line);
      }

      // Draw vertical lines
      for (var i = -diagonalLength; i <= diagonalLength; i += gridSize) {
        var line = new fabric.Line([i, -diagonalLength, i, diagonalLength], {
          stroke: "grey",
          strokeWidth: 5,
        });
        this.gridGroup.add(line);
      }

    // Set the clipTo function to limit the grid to the canvas boundaries
    this.gridGroup.clipTo = function (ctx) {
      ctx.rect(0, 0, canvasWidth, canvasHeight);
    };
      this.fabricCanvas.renderAll();
    }
  }

  // Function to rotate the grid
  rotateGrid() {
   var angle = document.getElementById("grid-rotation-slider").value;
   this.gridGroup.setAngle(angle);
   var angleDisplay = document.getElementById("angle-display");
   angleDisplay.innerText = angle;
   this.fabricCanvas.renderAll();
  }

   addPluginCSS(viewer){
        const pluginCSS = `
         body {
          overflow: hidden;
        }

        .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        }

        .switch input {
        opacity: 0;
        width: 0;
        height: 0;
        }

        .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        }

        .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        }

        input:checked + .slider {
        background-color: #2196F3;
        }

        input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
        border-radius: 34px;
        }

        .slider.round:before {
        border-radius: 50%;
        }

        #grid-rotation {
        display: none;
        }

        #grid-rotation.visible {
        display: inline-block;
        }

        #grid-rotation-container {
          display: none;
          margin-left: 10px;
        }

        #grid-rotation-slider.visible {
          display: inline-block;
        }

        #grid-rotation-label {
          display: inline-block;
          width: 30px;
          text-align: center;
          margin-left: 5px;
        }

        #grid-rotation-slider.visible + #grid-rotation-label {
          display: inline-block;
        }

        #grid-rotation-slider {
          display: none;
        }

        #info {
        position: absolute;
        z-index: 1000;
        bottom: 0;
        left: 0;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        min-height: 5vh;
        width: 8vw;
        color: white;
        font-family: sans-serif;
        font-size: 0.9em;
        }
        /* Grid */
        .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        }

        .switch input {
        opacity: 0;
        width: 0;
        height: 0;
        }

        .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        }

        .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        }

        input:checked + .slider {
        background-color: #2196F3;
        }

        input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
        }

        .slider-container {
        display: flex;
        align-items: center;
        }

        .slider-input {
        width: 100px;
        margin-right: 10px;
        }

        .slider-value {
        margin: 0;
        }
        /* Rounded sliders */
        .slider.round {
        border-radius: 34px;
        }

        .slider.round:before {
        border-radius: 50%;
        }

        #grid-rotation {
        display: none;
        }

        #grid-rotation.visible {
        display: inline-block;
        }

        #grid-rotation-container {
          display: none;
          margin-left: 10px;
        }

        #grid-rotation-slider.visible {
          display: inline-block;
        }

        #grid-rotation-label {
          display: inline-block;
          text-align: left;
          margin-left: 5px;
        }

        #grid-rotation-slider.visible + #grid-rotation-label {
          display: inline-block;
        }

        #grid-rotation-slider {
          display: none;
        }

        #grid-size {
        display: none;
        }

        #grid-size.visible {
        display: inline-block;
        }

        #grid-size-container {
          display: none;
          margin-left: 10px;
        }

        #grid-size-slider.visible {
          display: inline-block;
        }

        #grid-size-label {
         display: inline-block;
          text-align: left;
          margin-left: 5px;
        }

        #grid-size-slider.visible + #grid-size-label {
          display: inline-block;
        }

        #grid-size-slider {
          display: none;
        }

        #info {
        position: absolute;
        z-index: 1000;
        bottom: 0;
        left: 0;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        min-height: 5vh;
        width: 10vw;
        color: white;
        font-family: sans-serif;
        font-size: 0.9em;
        }
        `;
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(pluginCSS));
        document.head.appendChild(styleElement);
    }

  // Function to add the plugin HTML to the viewer element
  addPluginHTML(viewer) {
    // Create the plugin HTML
    const pluginHTML = `
    <div id="info">
        <span>Grid</span>
        <label class="switch" for="grid">
            <input type="checkbox" id="grid">
            <span class="slider round"></span>
        </label>
        <p id="grid-rotation-label"></p>
        <div class="slider-container">
            <input type="range" min="-180" max="180" value="0" id="grid-rotation-slider" class="slider-input">
            <p id="angle-display" class="slider-value"></p>
        </div>
        <p id="grid-size-label"></p>
        <div class="slider-container">
            <input type="range" min="100" max="5000" value="440" id="grid-size-slider" class="slider-input">
            <p id="grid-size-value" class="slider-value" style="display:none"></p>
        </div>
    </div>
  `;

    // Append the plugin HTML to the viewer element
    const viewerElement = document.getElementById(viewer.element.id);
    viewerElement.insertAdjacentHTML("beforeend", pluginHTML);

  // Attach event listeners using addEventListener
  document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
  document.getElementById("grid").addEventListener("change", this.toggleGrid);
  document.getElementById("grid-size-slider").addEventListener("input", this.changeGridSize);
}


  addGrid() {
    // Function to initialize the Grid
    const init = () => {
      this.viewer.addHandler("open", () => {
        var gridSize = 0.1 / this.conversionFactor; // Set the gridSize to 0.1 mm in pixels
        var world = this.viewer.world;
        if (world) {
          var imageSize = world.getItemAt(0).getContentSize();
          var canvasWidth = imageSize.x;
          var canvasHeight = imageSize.y;

          // Draw horizontal lines
          for (var i = 0 ; i <= canvasHeight; i += gridSize) {
              var line = new fabric.Line([0, i, canvasWidth, i], {
              stroke: "grey",
              strokeWidth: 5
            });
            this.gridGroup.add(line);
          }

          // Draw vertical lines
          for (var i = 0; i <= canvasWidth; i += gridSize) {
              var line = new fabric.Line([i, 0, i, canvasHeight], {
              stroke: "grey",
              strokeWidth: 5
            });
            this.gridGroup.add(line);
          }

          // Add the grid group to the overlay canvas
          this.fabricCanvas.add(this.gridGroup);
          this.gridGroup.visible = false;

          this.changeGridSize(); // Call the changeGridSize() function
        }
      });

      // Attach event listeners using addEventListener
          document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
          document.getElementById("grid").addEventListener("change", this.toggleGrid);
          document.getElementById("grid-size-slider").addEventListener("input", this.changeGridSize);
    };

    // Call the initialize function when the plugin is created
    init();
  }
}