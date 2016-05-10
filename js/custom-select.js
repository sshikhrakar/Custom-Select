;(function($){
	'use strict';

	var CustomSelect = {
		/**
		    * filter the options in select
		    * @param current selected div
		    * @author madandhungana <madandhungana@lftechnology.com>
		**/
		filterOptionInList : function(selectWrapper){
			var previousKeyCode = 15, // random keycode
				nextElementIndex = 0,
				enterKey = 13;
			$(selectWrapper).keydown(function (event) {
				var selectWrapperChildList = $(this).find(".custom-select-list");
				if(event.which === enterKey){
					$(selectWrapperChildList).removeClass('focused');
					$('.custom-select-option').slideUp();
				}
				else if((event.which > 64 && event.which < 91) || (event.which > 47 && event.which < 58) || (event.which > 95 && event.which < 106)) {
					var listStartingWithKeyChar = [],
						charOfKeyCode = String.fromCharCode(event.which),
						lowerCaseChar = charOfKeyCode.toLowerCase(),
						counter = 0;
					$(selectWrapperChildList).removeClass('focused');
					$(selectWrapperChildList).each(function(index, list){
						if($(list).text().trim().charAt(0) === lowerCaseChar || $(list).text().trim().charAt(0) === charOfKeyCode) {
							listStartingWithKeyChar[counter] = list;
							counter++;
						}
					});
					if(listStartingWithKeyChar.length !== 0){
						var currentUl = $(this).find(".custom-select-option");
						if (previousKeyCode === event.which) {
							$(listStartingWithKeyChar).eq(nextElementIndex).addClass('focused');
							CustomSelect.showSelectedOption(selectWrapper);
							if (nextElementIndex < listStartingWithKeyChar.length - 1) {
								nextElementIndex++;
							} else {
								nextElementIndex = 0;
							}
						} else {
							$(listStartingWithKeyChar).eq(0).addClass("focused");
							CustomSelect.showSelectedOption(selectWrapper);
							nextElementIndex = 0;
							if(listStartingWithKeyChar.length === 1){
								nextElementIndex = 0;
							}
							else{
								nextElementIndex++;
							}
						}
						var index = $(this).find('.focused').index(),
							heightOfList = $(this).find('.custom-select-list').innerHeight();
						currentUl.scrollTop(index*heightOfList); // scroll up to focused list.
					}
					previousKeyCode = event.which;
				}
			});
		},
		/**
		    * Toggle to view/hide options on click
		    * @param class name of the select input type [string]
		    * @author Shirish Shikhrakar
		**/
		viewOptions : function(className){
			var wrapper = $(className).parent('.custom-select-wrapper');
			wrapper.click(function(e){
				e.stopPropagation();
				var _this = $(this),
					customOption = _this.children('.custom-select-option'),
					hasDisabledAttribute = _this.children('select').attr('disabled');
				if(typeof hasDisabledAttribute === typeof undefined) {
					$('.custom-select-option').slideUp('fast');
					_this.attr("tabindex", '1');
					_this.focus();
					customOption.toggle();
					CustomSelect.filterOptionInList(_this);
					$(document).click(function(){
						customOption.slideUp('fast');
					});
					CustomSelect.showSelectedOption(_this);
				}
			});
		},
		/**
		    * Update the corresponding select with the list option selected
		    * @param list option of the ul [string]
		    * @author Shirish Shikhrakar
		 **/
		updateHtmlOption : function(list){
			var htmlOption = $(list).parent().siblings('select').children('option');
			$(htmlOption).each(function(){
				if($(this).text() === $(list).text()){
					$(this).prop('selected',true);
					$(htmlOption).not($(this)).each(function(i){
						$(this).removeProp('selected');
					});
					$(this).parent('select').change();
				}
			});
		},
		/**
		    * Show selected option in the select box
		    * @param class name of the select input type [string]
		    * @author Shirish Shikhrakar
		 **/
		showSelectedOption : function(wrapper){
			var $list = $(wrapper).children('.custom-select-option').children('.custom-select-list'),
				$holder = $(wrapper).children().next('.custom-select-holder');
			$list.each(function(){
				if($(this).hasClass('focused')){
					var listStyle = $(this).attr('style');
					$holder.text($(this).text());
						console.log($(this).next('option'))
					if(wrapper.attr('data-url') === undefined){
						$(wrapper).attr('style',listStyle);
					}
					CustomSelect.updateHtmlOption($(this));
				}
			});
			$list.click(function(e){
				e.stopImmediatePropagation();
				var listStyle = $(this).attr('style');
				$($list).removeClass('focused');
				$holder.text($(this).text());
				if(wrapper.attr('data-url')  === undefined){
					$(wrapper).attr('style',listStyle);
				}	
				CustomSelect.updateHtmlOption($(this));
				$(this).parent().slideUp('fast');
			});
		},

		imageStyle : function($target,imgUrl){
			$target.css({
				'background-image':'url(' + imgUrl + ')',
				'background-size' : '20px 20px',
				'background-position' :'10px center',
				'background-repeat': 'no-repeat',
				'padding-left' : '40px'
			});
		},
		/**
		    * Create a list as options for custom select
		    * @param class name of the select input type [string], wrapper that wraps the select
		    * @author Shirish Shikhrakar
		 **/
		generateOption : function(className,selectWrapper){
			var runOnce = true,
				$customUl = $('<ul></ul>').attr('class','custom-select-option'),
				option = $(className).children('option');
			$(option).each(function(i){
				var $list = $('<li></li>').attr('class','custom-select-list'),
					imageUrl = $(option[i]).attr('data-url');
				$list.append($(option[i]).text());
				if(imageUrl){
					CustomSelect.imageStyle($list,imageUrl);
				}
				$($customUl).append($list);
			});
			$(selectWrapper).append($customUl);
		},
		/**
		    * Show the first element in option as selected
		    * @param class name of the select input type [string]
		    * @author Shirish Shikhrakar
		 **/
		initialSelected : function(className,list){
			var selectedOption = $(className).find(":selected"),
				imageUrl = $(selectedOption).attr('data-url');
			$(className).next('.custom-select-holder').text(selectedOption.text());
			if(imageUrl){
				CustomSelect.imageStyle($(className).parent(),imageUrl);
			}
			/*if(list){
				var style = $(list).attr('style');
				$(className).next('.custom-select-holder').attr('style', style);
			}*/

			// $(className).next('.custom-select-holder').attr('style',$($list).attr('style'));
		},
		/**
		    * Design the wrapper according to the options
		    * @param class name of the select input type [string], options for plugin [hash map]
		    * @author Shirish Shikhrakar
		 **/
		makeCanvas : function(_this,options){
			var wrapper = $('.custom-select-wrapper'),
				wrapperHeight = wrapper.outerHeight(),
				option = wrapper.find('ul');
			option.css({'top': (wrapperHeight - 1) + 'px'});
			// if(_this.hasClass('error')){
			// 	borderColor = "#A94442";
			// 	_this.parent('.custom-select-wrapper').css({'border-bottom':'2px solid' + ' ' + borderColor});
			// }else{
			// 	_this.parent('.custom-select-wrapper').css({'border-bottom':'1px solid' + ' ' + borderColor});
			// }
		},
		/**
		    * Wrap the original select box with a span
		    * @param class name of the select input type [string]
		    * @author Shirish Shikhrakar
		 **/
		wrapElement : function(className){
			$(className).each(function(){
				var _this = $(this);
				_this.wrap($('<span></span>').attr('class','custom-select-wrapper'));
				_this.after("<span class='custom-select-holder'></span>");
				CustomSelect.initialSelected(_this);
				var selectWrapper = _this.parent('.custom-select-wrapper');
				CustomSelect.generateOption(_this,selectWrapper);
			});
		},

		tabFocus : function(className){
			var keyUp = function($element,focusStyle){
				var _this = $element,
					tab = 9;
			    $(window).keyup(function (e) {									
			        var code = (e.keyCode ? e.keyCode : e.which);
			        if (code === tab) {
			        	console.log('here')
			        	_this.parent().css(focusStyle);
			        }
			    });
			};
			className.on('focusout',function(e){
				var focusOutStyle = {'outline':'none',height:''};
				keyUp($(this),focusOutStyle);
			});
			className.on('focus', function(e){
				var focusInStyle = {'outline':'1px solid #5264AE'};
				keyUp($(this),focusInStyle);
			});
		},
		/**
		    * Initialize all methods
		    * @param class name of the select input type [string]
		    * @author Shirish Shikhrakar
		 **/
		init : function(className,options){
			CustomSelect.wrapElement(className);
			CustomSelect.viewOptions(className);
			CustomSelect.makeCanvas(className,options);
			CustomSelect.tabFocus(className);
		}
	};

	$.fn.CustomSelect = function(options){
		var defaultOption = {
				theme : "default",
				borderColor : "#5264AE"
			},
			pluginOptions = $.extend(defaultOption,options);

		CustomSelect.init(this,pluginOptions);
	};
}(jQuery));
