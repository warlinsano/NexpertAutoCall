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
require_once("connection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

//Descargar el log
if(isset($_REQUEST['file']))
{
	$file = $_REQUEST['file'];
	$file=substr($basepath,0,-1).$file;
	header('Content-type: text/csv');
	header("Content-disposition: attachment;filename=log.csv");
	
	$query = "select * from logs where csvFile='$file' and type='heading'";
	$result = mysql_query($query);
	$ret='';
	if($result and mysql_num_rows($result)>0)
	{
		$row = mysql_fetch_assoc($result);
		$head = explode(",",$row['fields']);
		
		for($i=0;$i<count($head);$i++)
		$ret.=$head[$i].",";	
		$ret.="Time,Status,Option Choosen";
	}
	
	$ret.="\n";
	
	$query = "select * from logs where csvFile='$file' and type='field'";
	$result = mysql_query($query);
	if($result and mysql_num_rows($result)>0)
	{
		for($i=0;$i<mysql_num_rows($result);$i++)
		{
			$row=mysql_fetch_assoc($result);
			$fields = explode(",",$row['fields']);
			
			for($j=0;$j<count($fields);$j++)
			{
				$ret.=$fields[$j].",";
			}
			$ret.=$row['time'].",".$row['status'].",".$row['options'];		
			$ret.="\n";
		}
	}
	echo $ret;
}
//GetAll the log
else{

    exec("ls -t files/",$files);  
      
    $jsondata = '{ "data": [';  
    foreach($files as $contador => $file)
    {
        if(preg_match("/csv$/",$file))
        {
            $size = filesize("files/$file")/1024;
            $filedate = date ("m/d/Y H:i:s", filemtime("files/$file"));
            $link = "logAPI.php?file=".urlencode($basepath."/files/$file");

            if($contador!= 0){ $jsondata.=','; }
            $jsondata.='{'; 
            $jsondata.=' "numero": '.$valor = 1 + $contador.','; 
            $jsondata.=' "nombre": "'.$file.'",' ;
            $jsondata.=' "peso": "'.$size.' KB",' ;
            $jsondata.=' "fechaCreacion": "'.$filedate.'",' ;
            $jsondata.=' "link": "'.$link.'" '; 
            $jsondata.= '}';
        }
    }
    $jsondata.= '] }' ;  

	//Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
	header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
	echo  $jsondata;
	exit();
}
?>