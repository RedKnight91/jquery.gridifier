(function( $ ){
	$.fn.gridify = function( settings ) {  
		var settings = $.extend( { // Default settings
			forceFit: false,
			fullView: false,
			debug: false,
			align: ""
		}, settings);

		return this.each(function() {
			var $container = $(this), //instantiate the container
			$img = $("img", this), //instantiate the image to resize
			$a = $img.parent("a"), //instantiate the image's possible anchor parent
			$cover = $(".grdCover", this),
			
			forceFit = settings.forceFit, //decides whether the resize of images smaller than their container must be forced to 100%
			fullView = settings.fullView, //decides whether the whole image should be fitted inside the container (max-width, max-height 100%)
			debug = settings.debug, //show/hide values useful for debug
			align = settings.align.split(" "), //align setting which decides how to align the img in the container
			
			isHeightAuto = isHeightAuto($container);
			
			fitImage($img);
			
			applyAlign();
			
			applyCover();
			
			$container.hover( //image's cover handler (optional)
				function() { $(".grdCover",this).stop(true).animate({top: 0}, 200) },
				function() { $(".grdCover", this).animate({top: ($container.height() + "px")}, 200) }
			);
			
			function fitImage($img){
				var cW = $container.width();
				var cH = $container.height();
				var w = $($img).width();
				var h = $($img).height();

				if (debug){
					console.log( "Container", $container[0]);
					console.log( "forceFit:", forceFit );
					console.log( "fullView:", fullView );
					console.log( "autoHeight:", isHeightAuto );
					console.log( "Container, before -", "Width:", cW +"px,", "Height:", cH +"px");
					console.log( $img[0] );
					console.log( "Image, before -", "Width:", w +"px,", "Height:", h +"px");
				}
				
				if (isHeightAuto){
					if (cW < w && cH < h) {
						$img.addClass("grdFlexSquare");
						if ( $a[0] ) { $a.css("max-height", $container.css("max-height")).css("max-width",$container.css("max-width")); }
					}
				}
				else{
					if ( w > h ) { $img.addClass("grdWide"); }
					else if ( w < h ) { $img.addClass("grdTall"); }
					else { $img.addClass("grdSquare"); }
					
					if (h > cH) { $container.css("height", $container.css("max-height") ); }
					if (forceFit) { $img.addClass("grdForce"); }
				}
				if (fullView) {
					$img.addClass("grdFullView");
					if ( $img.css("max-height") == "none") {
						$img.css("max-height", $container.height() );
					};
				}
				
				w = $img.width();
				h = $img.height();
				cW = $container.width();
				cH = $container.height();
				var dW = w - cW;
				var dH = h - cH;
				
				if (debug){
					console.log( "Container, after -", "Width:", cW +"px,", "Height:", cH +"px");
					console.log( "Image, after -", "Width:", w +"px,", "Height:", h +"px");
					console.log( "Difference -", "Width:", dW+"px,", "Height:", dH +"px\n");
				}
				
				$img.css({left : -dW/2, top: -dH/2 });
			}
			
			function applyCover() {
				$cover.css("top",$container.height()).css("visibility","visible");
			}
			
			function applyAlign() {
				var al;
				if (align.length==1){
					al = align[0];
					if ( al == "left" ) $img.css("left",0);
					else if ( al == "right" ) $img.css("right",Math.abs($container.width() - $img.width())).css("left","auto");
					else if ( al == "top" ) $img.css("top",0);
					else if ( al == "bottom" ) $img.css("bottom",Math.abs($container.height() - $img.height())).css("top","auto");
				}
				else if (align.length==2){
					al = align[0];
					if ( al == "left" ) $img.css("left",0);
					else if ( al == "right" ) $img.css("right",Math.abs($container.width() - $img.width())).css("left","auto");
					
					al = align[1];
					if ( al == "top" ) $img.css("top",0);
					else if ( al == "bottom" ) $img.css("bottom",Math.abs($container.height() - $img.height())).css("top","auto");
				}
			}
			
			function isHeightAuto(el) {
				$('body').append('<div id="isHeightAutoStage" style="visibility: hidden; height: 10px;"></div>');

				var clone = el.clone();
				clone.appendTo('#isHeightAutoStage');
				var initialHeight = clone.outerHeight(true);
				 
				clone.html('');
				var currentHeight = clone.outerHeight(true);
				if (currentHeight < initialHeight) return true;
				 
				clone.remove();
				$('#isHeightAutoStage').remove();
			 
				return false;
			};
		});
	};
})( jQuery );