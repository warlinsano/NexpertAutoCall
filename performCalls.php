<?php 
/**
* @file
*
* All NexpertAutoCall code is released under the GNU General Public License.
* See COPYRIGHT.txt and LICENSE.txt.
*.........................................
* Version 2.0
* Updated by software engineer Warlin Sano
* for support write to warlinsano@gmail.com
*.........................................
*/
require_once('connection.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

function str_getcsv_line($string){
	$string = preg_replace_callback(
        '|"[^"]+"|',
        create_function(
            '$matches',
            'return str_replace(\',\',\'*comma*\',$matches[0]);'
        ),$string );
		$array = explode(',',$string);
		$array = str_replace('*comma*',',',$array);
		return $array;
}

function spawn($cmd,$outputfile,$pidfile)
{
 exec(sprintf("%s >> %s 2>&1 & echo $! >> %s", $cmd, $outputfile, $pidfile));
  //$stringfromateado = sprintf("%s >> %s 2>&1 & echo $! >> %s", $cmd, $outputfile, $pidfile);
    // echo "<script type='text/javascript'>alert('" . $stringfromateado . "');</script>";
}
 
$config = parse_ini_file("config.ini",true);
$interval = $config['callblaster']['interval'];
if(!isset($_FILES['csvFile']) ) 
{
	// header('Status: 301 Moved Permanently', false, 301);
	// header('Location: index.php');
	//  exit();
	//echo "File upload error : ".$_FILES['csvFile']['error'];
	header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
	echo '{ "data":{ "estado": "false", "files":"", "mensaje":"Error al subir el archivo" }} ';
    exit();
}
// if($_POST['action']=="Upload and Initiate Calls")
// {
	if(!isset($_FILES['csvFile']) or $_FILES['csvFile']['error']>0)
	{
        // header('Status: 301 Moved Permanently', false, 301);
		// header('Location: index.php');
		header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
	    echo '{ "data":{ "estado": "false",  "files":"", "mensaje":"Error al subir el archivo" }} ';
        exit();
       //echo "File upload error : ".$_FILES['csvFile']['error'];
	}
	else
	{
        $reset_controls="pause=false\nstop=false";
        file_put_contents('control.ini', $reset_controls);
		$ts=time();
		$dest = $basepath."files/".$ts.$_FILES['csvFile']['name'];
		move_uploaded_file($_FILES['csvFile']['tmp_name'],$dest);
		
		$msg = "Recieved File $dest at ".date("r",time());
		file_put_contents("logs/uploads.txt",$msg,FILE_APPEND);

		$command = "php ".$basepath."asyncCall.php $dest";
		//echo $command;
		spawn("$command","/tmp/".$_FILES['csvFile']['name'],"/tmp/pid_".$_FILES['csvFile']['name']);
		header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
	    echo '{ "data":{ "estado": "true",  "files":"'.urlencode($dest).'", "mensaje":"Subido correctamente" }} ';
	}
// }

?>
