    
do{   
    date
    $fileCount=(get-childitem "c:\users\<<loginName>>\downloads").count
    echo $fileCount
    
    #detect if hung
    Get-WmiObject win32_processor | foreach-object{$x=$_.LoadPercentage}
    if  ($x -le 10) {

         
        write "hung process "
        #kill node
        gwmi win32_process -filter 'commandline like "%node%yahoodownload.js%"' | foreach-object{taskkill /f /pid $_.ProcessId}
        #kill all chrome instances
        gwmi win32_process -filter 'name like "chrome%"'| foreach-object{taskkill /f /pid $_.ProcessId}
        del c:\users\<<loginName>>\downloads\*.crdownload
        #startover
        start-process -filepath node -argumentlist "yahoodownload.js", "0", "1"
    }
    start-sleep -s 300
}while($x -le 11000)