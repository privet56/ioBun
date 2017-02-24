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
