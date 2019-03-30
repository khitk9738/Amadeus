// POST the data to the server using XMLHttpRequest
function Tracking() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://ipnrstatus.in/chrome.php';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    // Prepare the data to be POSTed by URLEncoding each field's contents
    var lccp_pnrno1 = encodeURIComponent(document.getElementById('lccp_pnrno1').value);
    
    var params = 'lccp_pnrno1=' + lccp_pnrno1;
    
    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() { 
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
	        statusDisplay.innerHTML = xhr.responseText;
                //window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
    statusDisplay.innerHTML = 'Retrieving...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {

    statusDisplay = document.getElementById('status-display');

    document.getElementById('ctracking').addEventListener('submit', Tracking);
});