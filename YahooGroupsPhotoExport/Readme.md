Download photos from Yahoo groups
============================

SUMMARY
-------
This node.js app downloads photos from yahoo groups.   Yahoo groups seems to be an unsupported product at this point.   There are no way to export the photos that was upload, except by clicking by navigating to the each album & clicking download on each photo.

The app uses webdriverio to communicate with selenium-server.   Selenium-server connects via chrome-driver to launch an instance of the Chrome browser and simulates user actions.

DESIGN NOTES
------------
1. This requires some experimentation to get the duration of pause after page load.

2. Yahoo group photos use dynamic scrolling.  It requires some experimentation to figure out the number of times to scroll for each album. 

3. The code can be run in three steps, with manual validation after each step.
	1. Navigate to the photo home page, scroll to end and download the HTML.  Extract JSON of album names, URL & photocount from HTML. Manually validate # albums that have info available.
	2. Navigate each photo album, scroll to end and download the HTML.  Extract JSON of photo names, URL.   Validate the # of download urls for each album matches the photocount retrieved in step #1.   If it doesn't adjust the scroll count & retry.
	3. Configure Fiddler as described below.   Retrieve each photo URL from the JSON & download it.  This can be farmed out by running instances of this app on different computers. Since this takes a while, it is best to let it run unattended.  The included powershell script checks for inactivity, kills everything and restarts the download.

4. Photos are downloaded by opening the URL in the browser instead of click on each download button.   As a result no HTTP\_REFERER will be sent to the server causing the download to file.   Fiddler needs to be configured as described below to send a HTTP_REFERER 

5. Detecting hangs.  The powershell script checks the CPU usage every 5 mins.   CPU usage < 10% is assumed to mean the process has hung.


SETUP INSTRUCTIONS
------------------
1. Install node.js

2. Install webdriver & cheerio using npm
	1. npm install

3. Download & setup chromedriver
	1. Download the latest version of chrome driver.  - http://chromedriver.storage.googleapis.com/index.html?path-2.13/
	2. Unzip to a folder.
	3. Update environment path to include the above folder.

4. Download & setup JRE.  This is needed by selenium-standalone (which is setup in the next step)

5. Download & setup selenium-standalone
	1. npm install -g selenium-standalone
	2. selenium-standalone install

6. Download, install & configure Fiddler.  This is needed to send HTTP_REFERER for the file downloads step.
	1. Download Fiddler & install fiddler.
	2. Configure HTTP_REFERER
		1. Navigate to Rules>Customize Rules.
		2. In the script, insert the following code at the beginning of the function called onBeforeRequest.
                       `if ( oSession.host.indexOf("yimg.com")>-1 && oSession.PathAndQuery.IndexOf('download=1')>-1 ){`
				`oSession.oRequest.headers.Add('Referer', 'https://groups.yahoo.com/neo/groups/<<albumName>>/photos/albums');`
			`}`

   3. At the beginning of the function called OnPeekAtResponseHeaders, add the following code.  This minimizes Fiddler memory consumption.
		`oSession.bBufferResponse = false;`
			
  4. In the bottow status bar, second pane from left, change setting to 'Hide All'.  This minimize Fiddler memory consumption.


USEFUL LINKS
-------------
1. http://webdriver.io/
2. https://sites.google.com/a/chromium.org/chromedriver/home
3. https://sites.google.com/a/chromium.org/chromedriver/capabilities
4. https://github.com/vvo/selenium-standalone
5. http://www.telerik.com/fiddler
6. http://stackoverflow.com/questions/21142310/memory-leak-and-performance-leak-in-fiddler2/21149421#comment44220988_21149421
7. http://docs.telerik.com/fiddler/Troubleshoot-Fiddler/OutOfMemory
