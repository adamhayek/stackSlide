// Plugin constructor
$.fn.stackSlide = function( options ) {
 
    // Extend default options with those provided.
    // Note that the first argument to extend is an empty
    // object – this is to keep from overriding "defaults" object
    var opts = $.extend( {}, $.fn.stackSlide.defaults, options )
 	
    //plugin implementation
    //get list of objects to build carousel
    var _this = this
 	var parent = $(this)

 	//add class to parent element
 	parent.addClass('stackslide')

 	//get all list items
 	var children = $(parent.children('li').get().reverse())

 	_this.selectedChildren = opts.selectedChildren || 0
 	_this.numberOfItems = children.length

 	children.each(function(i){
 		//get li element
 		var child = $(this)
 			child.attr('data-index', i)
 			child.addClass('stackslide-item')
			child.css('width', opts.width)

 		//resize image
 		var image = child.children('img')
			image.attr('width', '100%')
			image.addClass('stackslide-image')
			image.css('display', 'block')

		//append title element
 		var title = child.attr('data-title')
 		
 		if (opts.showTitle)
 			child.prepend('<h4 class="stackslide-title">'+ title +'</h4>')

 		//position item into the stack
 		var transition = 'top '+opts.animationDuration/1000+'s ease-in-out, left '+opts.animationDuration/1000+'s ease-in-out, right '+opts.animationDuration/1000+'s ease-in-out, opacity '+opts.animationDuration/1000+'s ease-in-out'

 		child.css({
	 			position: 'absolute',
	 			zIndex: i,
	 			'-webkit-transition': transition,
			    '-moz-transition': transition,
			    '-o-transition': transition,
			    '-ms-transition': transition,
	 			transition: transition
	 		})
 	})

	//add swipe for mobile devices
	if (typeof parent.swipe === 'function')
		parent.swipe({
			swipeLeft:function(event, direction, distance, duration, fingerCount) {
	          _this.prevSlide()
	        },

	        swipeRight:function(event, direction, distance, duration, fingerCount) {
	          _this.nextSlide()
	        }
	    })

 	//add interactive item selection
 	parent.children('li').on('click', function(e){
 		var newIndex = _this.numberOfItems-parseInt($(this).attr('data-index'))-1
 		var index = _this.selectedChildren
 		var count = 0

 		if (newIndex > index) {
 			var select = function(i){
 				if (i > newIndex) return

	 			setTimeout(function(){
	 				selectChildren(i++)
	 				select(i)
	 			}, (opts.animationDuration/(newIndex-index))*count++)
 			}

 			select(index)

	 	}else if(newIndex < index){
	 		var select = function(i){
 				if (i < newIndex) return
 					
	 			setTimeout(function(){
	 				selectChildren(i--)
	 				select(i)
	 			}, (opts.animationDuration/(index-newIndex))*count++)
 			}

 			select(index)
	 	}

	 	var selectChildren = function(i){
	 		//get selected item index
	 		_this.selectedChildren = i

			//update controls
			updateControls()

			//update children positions
			positionChildren()
	 	}
 		
 	})

 	//add controls
 	var prev, next

 	if (opts.orientation === 'left'){
		prev = $('<span class="stackslide-arrow" id="stackslide-arrow-prev"></span>')
	 	next = $('<span class="stackslide-arrow" id="stackslide-arrow-next"></span>')
 	}else{
 		prev = $('<span class="stackslide-arrow" id="stackslide-arrow-next"></span>')
	 	next = $('<span class="stackslide-arrow" id="stackslide-arrow-prev"></span>')
 	}

 	parent.append(prev)
 	parent.append(next)

 	var controls = [prev, next]
 		controls = $($.map(controls, function(el){return $.makeArray(el)}))

 	//add basic control styles
 	controls.css({
 		position: 'absolute',
 		width: opts.controlWidth,
 		height: opts.controlHeight,
 	})

 	//add transition to controls
 	var transition = 'opacity '+opts.animationDuration/1000+'s ease-in-out'
	
	controls.css({
		'-webkit-transition': transition,
	    '-moz-transition': transition,
	    '-o-transition': transition,
	    '-ms-transition': transition,
			transition: transition
	})

	//add functions to controls
	controls.first().on('click', function(){
 		_this.prevSlide()
 	})

 	controls.last().on('click', function(){
 		_this.nextSlide()
 	})

 	//slider functions
 	//show next slide
 	this.nextSlide = function(){
 		//return if last item
 		if (_this.selectedChildren >= _this.numberOfItems-1)
 			return

 		//increase count
 		_this.selectedChildren++

 		//update controls
 		updateControls()

 		//position items
 		positionChildren()

 		//send callback
 		if (opts.onSlide)
 			opts.onSlide(_this.selectedChildren)
 	}

 	//show previous slide
 	this.prevSlide = function(){
 		//return if last item
 		if (_this.selectedChildren == 0)
 			return

 		//decrease count
 		_this.selectedChildren--

 		//update controls
 		updateControls()

 		//position items
 		positionChildren()

 		//send callback
 		if (opts.onSlide)
 			opts.onSlide(_this.selectedChildren)
 	}

 	//select any slide
 	this.selectSlide = function(i){
 		//check for out of range requests
 		if (i < 0)
 			i = 0
 		else if (i > _this.numberOfItems-1)
 			i = _this.numberOfItems

 		//set selected children index
 		_this.selectedChildren = i

 		//update control states
 		updateControls()

 		//position children
 		positionChildren()
 	}

 	//select any slide
 	this.setWidth = function(width){
 		//update element width
		children.css('width', width)

 		//update control states
 		positionControls()

 		//position children
 		positionChildren()
 	}

 	//reusable interface functions
 	//set position of each image
 	var positionChildren = function(){
 		//get the actual item width
 		_this.width = children.outerWidth()

 		//position each children
 		children.each(function(){
 			//get li element
	 		var child = $(this)

	 		//get item index
	 		var i = parseInt(child.attr('data-index'))

	 		//position item in the stack
	 		var top, side
			var max = Math.max(_this.selectedChildren+1-(_this.numberOfItems-i), 0)

	 		if (i <= (_this.numberOfItems-_this.selectedChildren)-opts.maxStack) {
 				top = 0
 				side = 0
	 		}else{
	 			top = opts.marginTop*(Math.min((i+_this.selectedChildren)-(_this.numberOfItems-opts.maxStack), opts.maxStack-1))
	 			side = opts.marginSide*(Math.min((i+_this.selectedChildren)-(_this.numberOfItems-opts.maxStack), opts.maxStack-1))+(_this.width*max)+(opts.marginSide*max)
	 		}

	 		if (_this.numberOfItems < opts.maxStack) {
	 			top = opts.marginTop*(Math.min(i+_this.selectedChildren, _this.numberOfItems-1))
	 			side = opts.marginSide*(Math.min(i+_this.selectedChildren, _this.numberOfItems-1))+(_this.width*max)+(opts.marginSide*max)
	 		}

	 		if (opts.orientation === 'left')
	 			child.css({
		 			top: top,
		 			left: side
		 		})
	 		else
	 			child.css({
		 			top: top,
		 			right: side
		 		})

	 		//hide items exceeding maximum number of stacked items
	 		if (i < (_this.numberOfItems-_this.selectedChildren)-opts.maxStack) {
				child.css({
		 			opacity: 0.0
		 		})
			}else{
				child.css({
		 			opacity: 1.0
		 		})
			}
 		})
 	}

 	//update control classes
 	var updateControls = function(){
		controls.last().toggleClass('stackslide-arrow-disabled', _this.selectedChildren  >= _this.numberOfItems-1)
		controls.first().toggleClass('stackslide-arrow-disabled', _this.selectedChildren == 0)
 	}

 	var positionControls = function(){
 		var top, sideLeft, sideRight

	 	top = opts.marginTop*(Math.min(opts.maxStack-1, _this.numberOfItems-1))+(_this.maxHeight-opts.marginTop*Math.min(opts.maxStack-1, _this.numberOfItems-1))/2-opts.controlHeight/2
	 	sideLeft = opts.marginSide*(Math.min(opts.maxStack-1, _this.numberOfItems-1))+opts.controlSpacing
	 	sideRight = _this.width-opts.controlWidth+(opts.marginSide*Math.min(opts.maxStack-1, _this.numberOfItems-1))-opts.controlSpacing

	 	if (opts.orientation === 'left'){
	 		controls.first().css({
	 			top: top,
		 		left: sideLeft,
		 	})

	 		controls.last().css({
	 			top: top,
		 		left: sideRight,
		 	})
	 	}else{
	 		controls.first().css({
	 			top: top,
		 		right: sideLeft,
		 	})

	 		controls.last().css({
	 			top: top,
		 		right: sideRight,
		 	})
	 	}
 	}

 	//update max height
 	var updateMaxHeight = function(){
 		children.each(function(i){
	 		//clear current max height
	 		_this.maxHeight = 0

	 		//save new max height if higher
	 		_this.maxHeight = Math.max($(this).innerHeight()+opts.marginTop*Math.min(i, opts.maxStack-1), _this.maxHeight)
	 	})
 	}

 	//hide controls
 	parent.on('mouseleave', function(){
 		if (opts.hideControls) {
 			controls.css('opacity', 0.0)
 		}
 	})

 	//show controls
 	parent.on('mouseenter', function(){
 		if (opts.hideControls) {
 			controls.css('opacity', '')
 		}
 	})

 	//update controls initialy
 	updateControls()

 	//handle window resize
 	$(window).resize(function(){
		//get max height
		updateMaxHeight()

 		//position children
 		positionChildren()

 		//position controls
 		positionControls()

	 	//set parent height
	 	parent.css('height', _this.maxHeight+'px')
	})

	$(window).resize()
}
 
// Plugin defaults
$.fn.stackSlide.defaults = {
    marginTop: 20,
    marginSide: 20,
    width: 500,
    controlWidth: 34,
    controlHeight: 64,
    controlSpacing: 20,
    animationDuration: 150,
    selectedChildren: 0,
    orientation: 'left',
    maxStack: 5,
    showTitle: false,
    hideControls: true
}