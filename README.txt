# ioBun

## FORCED upgrade (ATTENTION: no backward-compatibility):
	$ npm install -g npm-check-updates		//only ONCE
	0 MAKE BACKUP 							//and remove node_modules
	$ ncu.cmd --upgradeAll					//possibly you need to paste the absolute path
	$ npm install							//'ng serve' & VSCode should NOT run
	$ npm outdated							//check if succeeded
	$ check if fixes necessary				//eg. below fix for pTooltip
	$ git commit & 'git push origin master'

## android build needs JDK & Android SDK:
	-> use startbuildandroid.bat

## how to install Babylon.js:
 	git clone https://github.com/BabylonJS/Babylon.js.git
	cd babylon.js/Tools/Gulp
	npm install
	cd..
	cd..
	cd..
	cp babylon.js/dist/* assets/babylonjs/

## TODO:
- update all npm libs
- mobile web:
	-- ie11: select too small
- splash longer: http://www.codingandclimbing.co.uk/blog/ionic-2-fix-splash-screen-white-screen-issue-14 & http://stackoverflow.com/questions/41544016/white-screen-after-splashscreen-ionic2-android-device



######################## possible problems: ########################

1) Could not reserve enough space for object heap
	SET JAVA_OPTS=%JAVA_OPTS% -Xms512M -Xmx1024M
	set JAVA_OPTIONS=%JAVA_OPTS%
	set _JAVA_OPTIONS=%JAVA_OPTS%

2) You have not accepted the license agreements of the following SDK components
   [Android SDK Platform 25]
	-> open the android sdk manager, download & accept lic. agreement 

3) The connection to the server was unsuccessful. (file ///android_asset/www/index.html)
	config.xml: <preference name="LoadUrlTimeoutValue" value="70000"/>
	or
	index.html -> main.html

4) Failure [INSTALL_PARSE_FAILED_NO_CERTIFICATES]   
	-> https://ionicframework.com/docs/guide/publishing.html
	-> https://forum.ionicframework.com/t/ionic-toturial-for-building-a-release-apk/15758

5) white screen death:
	1. ionic plugin add cordova-plugin-crosswalk-webview
		(but note: Crosswalk: "we have decided to discontinue support for Android 4.0")
	2. cordova platform update android
	AND
	install "Android Support Repository" (https://crosswalk-project.org/jira/si/jira.issueviews:issue-html/XWALK-5965/XWALK-5965.html)
	AND
	use chrome://inspect (https://medium.com/@houssemyahiaoui/ionic-zero-to-hero-part-4-how-to-fix-white-screen-of-death-e7e2709f1647#.xk8ddy99h)
