/* <script>document.write('<div id="eq-quote-box"></div><script src="{{url to script}}"><\/script>');</script></div> */

/* Settings */
var $feed_url = 'ENTER FEED URL',
    $symbol = 'ENTER SYMBOL',
    $exchange = 'ENTER EXCHANGE';

var request = new XMLHttpRequest();
request.open('GET', $feed_url, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
    embedQuoteBox(data);
  } else {
    console.log('Feed not available');
  }
};

request.send();

function embedQuoteBox(data) {
    var quoteDiv = document.getElementById('eq-quote-box');
    quoteDiv.innerHTML = '\
        <div class="stock-data">\
    		<div class="ir-quote-box">\
    			<div class="single-stock-info">\
    				<span class="pull-right">' + $symbol + '</span>\
    				Symbol\
    			</div>\
    			<div class="separator" style="border-bottom:1px dotted #e9e9e9;margin:20px 0;"></div>\
    			<div class="single-stock-info">\
    				<span class="pull-right">' + $exchange + '</span>\
    				Market\
    			</div>\
    			<div class="separator" style="border-bottom:1px dotted #e9e9e9;margin:20px 0;"></div>\
    			<div class="single-stock-info market-cap">\
    				<span class="pull-right" id="data-market-cap"></span>\
    				Market Cap\
    			</div>\
    			<div class="separator" style="border-bottom:1px dotted #e9e9e9;margin:20px 0;"></div>\
    			<div class="single-stock-info price">\
    				<span class="pull-right" id="data-price"></span>\
    				Price\
    			</div>\
    			<div class="separator" style="border-bottom:1px dotted #e9e9e9;margin:20px 0;"></div>\
    			<div class="single-stock-info change">\
    				<span class="pull-right" id="data-change"></span>\
    				Change\
    			</div>\
    			<div class="separator" style="border-bottom:1px dotted #e9e9e9;margin:20px 0;"></div>\
    			<div class="single-stock-info volume">\
    				<span class="pull-right" id="data-volume"></span>\
    				Volume\
    			</div>\
    		</div>\
        </div>';
        
    var market_cap = document.getElementById('data-market-cap'),
        price = document.getElementById('data-price'),
        change = document.getElementById('data-change'),
        volume = document.getElementById('data-volume');
    
    if (data.market_cap != 'N/A') {
        market_cap.innerHTML = '$' + data.market_cap;
    } else {
        market_cap.innerHTML = data.market_cap;
    }
    if (data.last != 'N/A') {
        price.innerHTML = '$' + data.last;
    } else {
        price.innerHTML = data.last;
    }
    change.innerHTML = data.change;
    if (!data.volume) {
        volume.innerHTML = '0';    
    } else {
        volume.innerHTML = data.volume;
    }
    
}