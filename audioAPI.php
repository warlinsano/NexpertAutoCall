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

//POST ADD AUDIO
require_once('config.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);

global $basepath;
if(isset($_FILES['audioFile']))
{
	if($_FILES['audioFile']['name'] != ''){
			$tmpDest = $basepath."tmp/".str_replace(' ', '',$_FILES['audioFile']['name']);
			$exten = pathinfo($_FILES['audioFile']['name']);
			$exten = '.'.$exten['extension'];
			
			$fileName=str_replace(' ', '',basename($_FILES['audioFile']['name'], $exten));
			
			$dest = $basepath."/audio/$fileName.wav";
			move_uploaded_file($_FILES['audioFile']['tmp_name'],$tmpDest);
			
            $out=shell_exec('asterisk -rx "file convert '. $tmpDest.' '.$dest.'"');
            
			echo "true"; // Audio Agregado Exitosamente 			//var_dump($out);
    }
    else{
     //echo "false"; //El archivo deve tener un nombre
    }
}
elseif(isset($_REQUEST['action']) && $_REQUEST['action']=="Delteaudio" )
{
    $audio = $_REQUEST['nameaudio'];
    $cmd = "mv audio/$audio Delete";
    // Mover el archivo:
    //move_uploaded_file("audio/$audio","Delete/$audio");
    //copy("/audio/$audio","/Delete/$audio");
    // exec($cmd);  //  https://192.99.111.247/callblaster/audioAPI.php?nameaudio=welcome.wav&action=Delteaudio
    //$salida = shell_exec('mv audio/'.$audio.' Delete');
    unlink("audio/$audio");

    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo  '{"data":"'.$audio.'"}';
    exit();
}
else{
       // echo "false"; //no existe el paramentro *audioFile
        exec("ls -t audio/",$files);
      
        $jsondata = '{ "data": [';  
        foreach($files as $contador => $file)
        {
                $size = filesize("audio/$file")/1024;
                $filedate = date ("m/d/Y H:i:s", filemtime("audio/$file"));
                $link = "audio/$file";

                if($contador!= 0){ $jsondata.=','; }
                $jsondata.='{'; 
                $jsondata.=' "numero": '.$valor = 1 + $contador.','; 
                $jsondata.=' "nombre": "'.$file.'",' ;
                $jsondata.=' "peso": "'.$size.' KB",' ;
                $jsondata.=' "fechaCreacion": "'.$filedate.'",' ;
                $jsondata.=' "link": "'.$link.'" '; 
                $jsondata.= '}';            
        }
        $jsondata.= '] }' ;  

    //Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo  $jsondata;
    exit();
}

?>