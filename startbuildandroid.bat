cls
rem do it ONCE: ionic platform add android	rem do it ONCE: cordova platform add android
rem needs Java 8.x
SET JAVA_HOME=c:\java\jdk1.8.0.win32
SET JAVA_OPTS=%JAVA_OPTS% -Xms512M -Xmx1024M
set JAVA_OPTIONS=%JAVA_OPTS%
set _JAVA_OPTIONS=%JAVA_OPTS%
SET ANDROID_HOME=c:\Qt\android\android-sdk_r24.3.3-windows
SET ANDROID_NDK_HOME=c:\Qt\android\android-ndk-r10e-windows-x86
SET ANT_EXECUTABLE=C:\Qt\android\apache-ant-1.9.5\bin\ant.bat
SET PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\bin;%PATH%

rem ionic build android --prod				//--release
rem ionic run android --prod    		    //--release --devide is optional
