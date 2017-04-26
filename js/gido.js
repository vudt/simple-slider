            $( function() {
		$( "#sutrix_slider" ).simpleSlider( {
                    auto    : true,
                    delay   : 3000,
                    widthLi : '980',
		} );
            } );
            
            ;(function ( $, window, document, undefined ) {
    
            // undefined is used here as the undefined global variable in ECMAScript 3 is
            // mutable (ie. it can be changed by someone else). undefined isn't really being
            // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
            // can no longer be modified.

            // window is passed through as local variable rather than global
            // as this (slightly) quickens the resolution process and can be more efficiently
            // minified (especially when both are regularly referenced in your plugin).

            // Create the defaults once
            var pluginName = 'simpleSlider',
                defaults = {
                    propertyName: "value",
                    auto: true,
                };
            var locked = false;
            var myTimer;
            // The actual plugin constructor
            function Plugin( element, options ) {
                this.element = element;
                // jQuery has an extend method which merges the contents of two or
                // more objects, storing the result in the first object. The first object
                // is generally empty as we don't want to alter the default options for
                // future instances of the plugin
                this.options = $.extend( {}, defaults, options) ;
                this._defaults = defaults;
                this._name = pluginName;
                var next_element = $(this.element).find('.arrow-right');
                var prev_element = $(this.element).find('.arrow-left');
                this.init(next_element, prev_element, options, element);
            }

            Plugin.prototype.init = function (next_element, prev_element, options, element) {
                this.count = $(this.element).find('.slides li').length;
                this.setWidthUL(element);
                this.bindEvents(next_element, prev_element);
                if(this.options.auto == true) {
                    this.runSlideShow(1);
                }
            };
            
            Plugin.prototype.setWidthUL = function(elm){
                var num = $(elm).find('.slides li').length;
                var widthUL_element = num * this.options.widthLi;
                $(elm).find('.slides').css({"width": widthUL_element});
            };
           
            // Bind events that trigger methods
            Plugin.prototype.bindEvents = function(next_element, prev_element) {
                this.clickNext(next_element);
                this.clickPrev(prev_element);
            };
            
            Plugin.prototype.clickPrev = function (prev_element) {
                var fn = this;
                prev_element.click(function(){
                    if(locked != true) {
                        locked = true;
                        clearInterval(myTimer);
                        var rel = parseInt($('.slides li[status="active"]').attr('rel'));
                        var new_rel = 0;
                        new_rel = (rel == 1)? fn.count : rel - 1;
                        var marginLeft_Current  = parseInt($('.slides').css('margin-left')); 
                        var marginLeft_New      = 0;
                        marginLeft_New = (new_rel == fn.count)? (-980 * (fn.count-1)) : marginLeft_Current + 980;
                        fn.run(marginLeft_New, new_rel);
                        setTimeout(function(){
                            locked = false; // unlock;
                        },450);
                    }
                });
            };
            
            Plugin.prototype.clickNext = function (next_element) {
                var fn = this;
                next_element.click(function () {
                    if(locked != true) {
                        locked = true;
                        clearInterval(myTimer);
                        var rel = parseInt($('.slides li[status="active"]').attr('rel'));
                        var new_rel = 0;
                        new_rel = (rel == fn.count) ? 1 : parseInt(rel + 1);
                        var marginLeft_Current = parseInt($('.slides').css('margin-left'));
                        var marginLeft_New = (new_rel == 1) ? 0 : marginLeft_Current - 980;
                        fn.run(marginLeft_New, new_rel);
                        setTimeout(function(){
                            locked = false; // unlock;
                            console.log('un lock');
                        },450);
                    }
                });
            };
            
            Plugin.prototype.run = function (width, rel) {
                var $fn = this;
                $('.slides').animate(
                    {
                        marginLeft: width+"px"   
                    },
                    {
                        duration: 400,
                        complete: function(){
                            $('.slides li').attr('status', '');
                            $('li[rel="'+rel+'"]').attr('status', 'active');
                            $fn.runSlideShow(rel);   
                        }
                    }
                ); 
            };
            
            Plugin.prototype.runSlideShow = function (i) {
                var $fn = this;
                    
                myTimer = setInterval(function () {
                    if (locked != true) {
                        locked = true;
                        var width = -980;
                        if (i == $fn.count || i > $fn.count) {
                            i = 0;
                        } 
                        width = i * width;

                        $('.slides').animate(
                            {
                                marginLeft: width + "px"
                            },
                            {
                                duration: 400,
                                complete: function () {
                                    $('.slides li').attr('status', '');
                                    $('li[rel="' + i + '"]').attr('status', 'active');
                                    locked = false; // unlock;              
                                }
                            }
                        );
                        i++;
                    }
                }, this.options.delay);
            };

            // You don't need to change something below:
            // A really lightweight plugin wrapper around the constructor,
            // preventing against multiple instantiations and allowing any
            // public function (ie. a function whose name doesn't start
            // with an underscore) to be called via the jQuery plugin,
            // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
            $.fn[pluginName] = function ( options ) {
                var args = arguments;

                // Is the first parameter an object (options), or was omitted,
                // instantiate a new instance of the plugin.
                if (options === undefined || typeof options === 'object') {
                    return this.each(function () {

                        // Only allow the plugin to be instantiated once,
                        // so we check that the element has no plugin instantiation yet
                        if (!$.data(this, 'plugin_' + pluginName)) {

                            // if it has no instance, create a new one,
                            // pass options to our plugin constructor,
                            // and store the plugin instance
                            // in the elements jQuery data object.
                            $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                        }
                    });

                // If the first parameter is a string and it doesn't start
                // with an underscore or "contains" the `init`-function,
                // treat this as a call to a public method.
                } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

                    // Cache the method call
                    // to make it possible
                    // to return a value
                    var returns;

                    this.each(function () {
                        var instance = $.data(this, 'plugin_' + pluginName);

                        // Tests that there's already a plugin-instance
                        // and checks that the requested public method exists
                        if (instance instanceof Plugin && typeof instance[options] === 'function') {

                            // Call the method of our plugin instance,
                            // and pass it the supplied arguments.
                            returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                        }

                        // Allow instances to be destroyed via the 'destroy' method
                        if (options === 'destroy') {
                          $.data(this, 'plugin_' + pluginName, null);
                        }
                    });

                    // If the earlier cached method
                    // gives a value back return the value,
                    // otherwise return this to preserve chainability.
                    return returns !== undefined ? returns : this;
                }
            };

        }(jQuery, window, document));   