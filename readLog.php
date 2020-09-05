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

$validar = (isset($_GET['file']) && !empty($_GET['file']));

if($validar){
	require_once("connection.php");
	if($_REQUEST['action']=="getLog")
	{
		$file = trim(urldecode($_REQUEST['file']));
		$query = "select * from logs where csvFile='$file' and type='field' and time>DATE_SUB(NOW(),INTERVAL 5 MINUTE)";
		//$query = "select * from logs where csvFile='$file' and type='field' and status!='Completed' and time>DATE_SUB(NOW(),INTERVAL 5 MINUTE)";
		//$query = "select * from logs where csvFile='/var/www/html/callblaster/files/1596459378CallblasterList.csv' and type='field'";
		// $file = $_REQUEST['file'];
		// $query = "select * from logs where csvFile='$file' and type='field' ";
		//$query = "UPDATE logs SET options ='1', status='Dial Failed' WHERE csvFile='/var/www/html/callblaster/files/1596459378CallblasterList.csv' and autoID=64984 ";

		//$query = "select * from logs where type='field' ";
		$result = mysql_query($query);
		
		if (!$result) {
			die('Consulta no válida: ' . mysql_error());
		}
		$contador=0;
		$jsondata = '{ "data": [';  
		while ($fila = mysql_fetch_assoc($result)) {	
		    $audio="";
		    $phone="";
			$porciones = explode(",", $fila['fields']);
			if($porciones){
				$audio = str_replace('"','',$porciones[0]);//$porciones[0]; // audio    str_replace("world","Peter","Hello world!");
				$phone = str_replace('"','',$porciones[1]);//$porciones[1]; // phone   str_replace( $porciones[0],'"', '');		
			}

			if($contador!= 0){ $jsondata.=','; }
			$jsondata.='{'; 
			$jsondata.=' "autoID": '.$fila['autoID'].','; 
			$jsondata.=' "time": "'.$fila['time'].'",' ;
			$jsondata.=' "status": "'.$fila['status'].'",';
			$jsondata.=' "type": "'.$fila['type'].'",' ;
			$jsondata.=' "options": "'.$fila['options'].'",' ;
			$jsondata.=' "fields": "'.str_replace('"','',$fila['fields']).'",' ;
			$jsondata.=' "csvFile": "'.str_replace('"','',$fila['csvFile']).'", '; 
			$jsondata.=' "audio": "'.$audio.'",' ;
			$jsondata.=' "phone": "'.$phone.'"' ;
			$jsondata.= '}';  
			$contador++;          			
		}
		$jsondata.= '] }' ;  
		//Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
		header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
		echo  $jsondata;
		exit();
	}
}
else{
	header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
	echo "{De ve enviar los parametros por el metodo http GET}";
	exit();
}
?>
