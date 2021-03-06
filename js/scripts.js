var jq = jQuery.noConflict();

jq(document).ready(function() {

    FastClick.attach(document.body);

    jq('.mobile-nav-trigger').click(function(){
        jq('.main-nav').css('height', 'auto');
    });
    
    var menuRight = document.getElementById( 'mobile-nav' ),
    showRight = document.getElementById( 'showRight' ),
    body = document.body;

    jq('.video-placeholder').click(function(){
        var video = '<iframe src="'+ jq(this).attr('data-video') +'"></iframe>';
        jq(this).replaceWith(video);
    });
    
    if (showRight) {
        showRight.onclick = function() {
            jq(this).toggleClass("active");
            jq('body').toggleClass('push-to-left');
            jq(menuRight).toggleClass("cbp-spmenu-open");
            disableOther( 'showRight' );
            toggleMenuKeybind();
        };
    }
    function disableOther( button ) {
        if( button !== 'showRight' ) {
          jq(showRight).toggleClass("disabled");
        }
    }
    
    /**
     * This function handles keydown events when a full screen nav is present, allowing
     * the navigation to be closed by pressing the esc key
     */
    
     function toggleMenuKeybind() {
        var $body = jq('body'),
            $body_events = $body.data("events");
            
        if ($body_events != null && typeof($body_events.keydown) != undefined) {
            $body.off('keydown');
        }else {
        $body.on('keydown', function(e) {
            if (e.which == 27) {
                jq('.main-nav').toggleClass("active");
                jq('body').toggleClass('push-to-left');
                jq(menuRight).toggleClass("cbp-spmenu-open");
                disableOther( 'showRight' );
                $body.off('keydown');
            }
        });
        }
    }

    // Basic Form Validation
    var validator = jq(".validate-form").validate();
    jq('.toggle-button').click(function() {
        jq(this).toggleClass("open");
    });
    
    if (validator) {
        jq('.validate-form input[type="text"]').rules( "add", {
        alphanumeric: true
    });
    }

    jq('.fancybox').fancybox({
        helpers: {
            overlay: {
                locked: false
            }
        },
        minHeight: '600'
    });

    //Bootrap Select
    jq('.selectpicker').selectpicker({
        iconBase: 'DIN',
        tickIcon: 'no-icon'
    });
    
    //File input
    var fileInput = jq('.file-text input');
    fileInput.change(function(){
        $this = jq(this);
        jq(this).parent('.file-text').children('.text-wrapper').text($this.val());
    });

    //Video Player
    if (!Modernizr.touchevents) {
        jq('.video-player').fancybox({
            type: 'iframe',
            beforeShow: function() {
                var frame_width = jq(this.element).data("width"),
                    frame_height = jq(this.element).data("height");
                if (frame_width) {
                    this.width = frame_width;
                }
                if (frame_height) {
                    this.height = frame_height;
                }
            }
        });
    } else {
        jq('body').addClass('touch-device');
        jq(".video-player").each(function(index) {
            var video = jq(this).data('video');
            jq(this).attr('href', video);
        });
        jq('.fancybox,.thickbox').each(function() {
            jq(this).removeClass('thickbox').removeClass('fancybox').attr('target', '_blank');    
        });     
    }

    // SEC Filing Filters - auto submit form
    jq('#sec-filing-filter select').on('change', function(e) {
        jq(this).closest('form').submit(); 
    });


});

// SEC Filings expand
jq(".spr-expandable").hide();
jq(".spr-toggle-expandable").click(function() {
	jq(this).next(".spr-expandable").toggle("blind");
});

// Equal Heights
jq(window).load(function() {
    checkWidth();
});

function checkQuoteProperty(value) {
    return (value != "N/A") ? parseFloat(value).toFixed(2) : value;
}
// Quote Box
function populateQuoteBox(quote) {

    if (jq('.ir-quote-box').length > 0) {
        var quoteContainer = jq('.ir-quote-box[data-symbol="' + quote.symbol + '"]');
    } else {
        var quoteContainer = jq('.quote-box[data-symbol="' + quote.symbol + '"]');
        var home_change = true;
    }

    var quote_price = checkQuoteProperty(quote.last),
        quote_change = checkQuoteProperty(quote.change),
        quote_change_pct = checkQuoteProperty(quote.change_pct),
        quote_high = checkQuoteProperty(quote.high),
        quote_low = checkQuoteProperty(quote.low),
        quote_day_low = checkQuoteProperty(quote.day_low),
        quote_day_high = checkQuoteProperty(quote.day_high);

    quoteContainer.find('.time').html('<time />');
    quoteContainer.find('time').attr('datetime', quote.last_trade_time).html(quote.last_trade_time);
    quoteContainer.find('.price .value').html('$' + quote_price);
    quoteContainer.find('.volume .value').html(quote.volume).digits();

    if (quote.market_cap == 'N/A') {
        quoteContainer.find('.market-cap').hide();
    } else {
        quoteContainer.find('.market-cap .value').html('$' + quote.market_cap);
    }

    var change = quote_change.replace(/[+|-]/g, '');

    
    quoteContainer.find('.change .value .number').html(change);
    
    if(quote_change_pct != '0.00' && quote_change_pct != 'N/A' && quote_change_pct != '0' ) {
        quoteContainer.find('.change .value .percent').html('(' + quote_change_pct + '%)');
    }
    if (home_change) {
        quoteContainer.find('.change .home-change-value').html(change);
    }

    if (quote.change.indexOf('+') > -1 && change !== '0' && change !== '0.00') {
        quoteContainer.find('.change').addClass('up');
    } else if (quote.change.indexOf('-') > -1) {
        quoteContainer.find('.change').addClass('down');
    }
    
    if (quote.low == quote.high) {
        week = quote_low;    
    } else {
        var week = quote_low + ' - ' + quote_high;         
    }
    quoteContainer.find('.week-range .value').html(week);

    if (quote.day_low != 'N/A' && quote.day_high != 'N/A') {
        if (quote.day_low == quote.day_high) {
            var day = quote_day_low;
        } else {
            day = quote_day_low + ' - ' + quote_day_high;
        }
        quoteContainer.find('.day-range .value').html(day);
    } else {
        quoteContainer.find('.day-range .value').html(quote.last)
    }

}

function abbrNum(number, decPlaces) {
    var orig = number;
    var dec = decPlaces;
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["K", "M", "B", "T"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // console.log(number);
            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    //console.log('abbrNum('+ orig + ', ' + dec + ') = ' + number);
    return number;
}

// Add commas to numbers
jq.fn.digits = function() {
    return this.each(function() {
        jq(this).text(jq(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    });
};

//Smooth scroll to
function goToByScroll(id) {
    jq('html,body').animate({
        scrollTop: jq(id).offset().top
    }, 'slow');
}
jq('.smooth').click(function() {
    goToByScroll(jq(this).attr('href'));
    return false;
});

//Check Width
jq(window).resize(function() {
    checkWidth();
});

function checkWidth() {
    if (jq(window).width() > 767) {
        jq('.js-same-height, .js-same-height-row').each(function() {
            jq(this).addClass('active');
        });
        sameHeight();
    } else {
        jq('.js-same-height, .js-same-height-row').each(function() {
            jq(this).removeClass('active');
        });
        jq(".js-same-height,.js-same-height-row .js-height").css('min-height', 0);
    }
    if (jq(window).width() < 769) {
        jq('.fancybox').each(function() {
            jq(this).addClass('.fancybox-holder').removeClass('fancybox');
        });
        jq('.thickbox').each(function() {
            jq(this).addClass('.thickbox-holder').removeClass('thickbox');
        });
    } else {
        jq('.fancybox-holder').each(function() {
            jq(this).addClass('.fancybox').removeClass('fancybox-holder');
        });
        jq('.thickbox-holder').each(function() {
            jq(this).addClass('.thickbox').removeClass('thickbox-holder');
        });
    }

}

// Add Background
function add_bg(element) {
    var bg = jq(element).data('bg-image'),
        color = jq(element).data('bg-color'),
        repeat = jq(element).data('bg-repeat');
    if (bg !== undefined) {
        jq(element).css("background-image", "url(" + bg + ")");
    }
    if (color !== undefined) {
        jq(element).css("background-color", color);
    }
    if (repeat !== undefined) {
        jq(element).css('background-repeat', repeat);
    }
}

// Same Height
function sameHeight() {
    jq('#sidebar').css('min-height', 0);
    var $sidebar_min_height = jq('#sidebar + div').outerHeight();
    jq('#sidebar').css('min-height', $sidebar_min_height);
    jq(".js-same-height-row").each(function() {
        var $maxHeight = 0,
            $window_width = jq(window).width();
        jq('.js-same-height', this).css({
            'height': 'auto',
            'min-height': 0
        });
        if ((jq(this).data('cutoff') && jq(this).data('cutoff') >= $window_width) || $window_width < 768) {
            return false;
        }
        jq('.js-same-height', this).each(function() {
            if (jq(this).outerHeight() > $maxHeight) {
                $maxHeight = jq(this).outerHeight();
            }
        }).css('min-height', $maxHeight);
        jq('.js-height', this).css({
            'height': $maxHeight,
            'min-height': 0
        });
    });
}

// Fixes XBRL Filing Close Button click event being unbound by an early call to tb_remove
jq(document).ajaxComplete(function() {
    jq('#TB_closeAjaxWindow #TB_closeWindowButton').on('mousedown', function() {
        tb_remove();
    });
});