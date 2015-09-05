# jQuery stackSlide
Display list of images as an interactive stack gallery. Customisable. Responsive. Supports swipe gestures.

### Dependencies:
- jQuery

### Example:
[See basic example](https://cdn.rawgit.com/adamhayek/stackSlide/master/example/index.html#1-0-0)

### How to:
##### HTML:
```html
<ul id="stackslide-list-left">
	<li data-title="Test image 1"><img src="../images/sample1.jpg" alt="image"></li>
	<li data-title="Test image 2"><img src="../images/sample2.jpg" alt="image"></li>
	...
</ul>
```

##### Setup:
```js
var stackSlide = $('#stackslide').stackSlide({
	//custom options
})
```

##### Customisable options:
```js
options: {
  marginTop: 20, //stack top spacing
  marginSide: 20, //stack side spacing
  width: '500px', //item width (px, %..)
  controlWidth: 34, //control width in px
  controlHeight: 64,//control height in px
  controlSpacing: 20, //control spacing in px
  orientation: 'left', //slide direction ('left', 'rigth')
  animationDuration: 150, //animation duretion in ms
  maxStack: 5, //maximum number of visible items in stack
  showTitle: false, //append title to item
  hideControls: true //hide controls on mouseout,
  selectedChildren: 0, //default value for selected item
  onSlide: function(i){} //callback with current index 
}
```

##### Swipe gestures support:
To support swipe gestures, include jQuery Touch Swipe plugin: https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
