# OSDGrid
Grid with OpenSeadragon!

This plugin was created as part of [the Axolotl Project](https://github.com/verrochi92/axolotl/) for the McCusker lab at UMass Boston.
OSDGrid is a specialized grid tool for OpenSeadragon that adds grid and allows rotating of grid and change grid size from OpenSeadragon-compatible images easy
and fast.

![OSDGrid Plugin Screenshot](OSDGrid.png)
*Example of the OSDGrid plugin in action.*

[Click here to try it out!](https://verrochi92.github.io/axolotl/viewer.html?tileSource=W255B_0)

## Setup

OSDGrid is easy to use. First, there are some dependencies:

1. [OpenSeadragon](http://openseadragon.github.io/)
2. [Fabric.js](http://fabricjs.com/)
3. [Fabric.js overlay plugin for OpenSeadragon](https://github.com/altert/OpenseadragonFabricjsOverlay)

Once the dependencies and plugin are setup, simply include them in the HTML:

`
<script src="OSDGridPlugin.min.js"></script>
`

You will need to instantiate an OpenSeadragon viewer with the following options:

```
    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
        useCanvas: true,
        preventDefaultAction: true
    });
```

Where `"viewer"` is the id of the HTML element to create the viewer and `tileSource` is the directory to the image to load into the viewer.
Other options can be customized without affecting OSDGRidPlugin. (As far as I know! If you find otherwise, please let me know!)
The bigger the viewer, the better, especially if using our custom UI, I recommend setting height and width to 100%.
Please see the [OpenSeadragon documentation](http://openseadragon.github.io/docs/) or some of the
[examples](http://openseadragon.github.io/#examples-and-features) to learn more if you are unfamiliar.

## Usage

Using the viewer, you can instantiate an instance of the plugin, which will add all the functionality to the viewer.

`
let plugin = new OSDGridPlugin(viewer, {});
`
The second argument is an anonymous object containing the options for the plugin. The options available are as folows:

1. `conversionFactor`: Factor to multiply by to convert to real-world units. By default this is 1.
2. `units`: A string used to represent the units, for example, `"um"`. By default this is `"px"`.
3. `measurementColor`: Sets the color to render measurements in. By default this is black, but using he built-in UI, there is an easy way to change colors.
4. `useBuiltInUI`: Generates a built-in UI, including color selection, naming measurements, and buttons for other functionality.

## The UI

Our UI is simple and clean, and is suitable for most purposes if you are using this library.
To turn on the grid simply slide the grid slider in the bottom left corner and once grid is on you can adjust
the grid size and rotate the grid accordingly.


