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

//GET 
if(!$_POST) {
    $config = parse_ini_file("config.ini",true);
    $interval = $config['callblaster']['interval'];
    $context1 = $config['press1']['context'];
    $exten1 = $config['press1']['extension'];
    $context2 = $config['press2']['context'];
    $exten2 = $config['press2']['extension'];
    
    $jsondata = '{ "data": [';  
                $jsondata.='{'; 
                $jsondata.=' "interval": '.$interval.','; 
                $jsondata.=' "context1": "'.$context1.'",' ;
                $jsondata.=' "extension1": "'.$exten1.'",' ;
                $jsondata.=' "context2": "'.$context2.'",' ;
                $jsondata.=' "extension2": "'.$exten2.'" '; 
                $jsondata.= '}';            
        $jsondata.= '] }' ;  
    
    //Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo  $jsondata;
    exit();
}

//GET By Id
// if($_GET) {
// }

//validacion
// Si todos los campos se han enviado, entonces, «$post» será «true»,
// de lo contrario será «false»:
$post = (isset($_POST['intervalo']) && !empty($_POST['intervalo'])) &&
        (isset($_POST['ext1']) && !empty($_POST['ext1'])) &&
        (isset($_POST['ext2']) && !empty($_POST['ext2']));

//POST
// Si $post es true (verdadero), entonces se mostrarán los resultados:
if ( $post ) {
    require_once ('config.php');
    $conte1="from-internal";
    $conte2="from-internal";

    if(isset($_POST['context1']) && !empty($_POST['context1'])){
        $conte1=$_POST['context1'];
    }
    if(isset($_POST['context2']) && !empty($_POST['context2'])){
        $conte2=$_POST['context2'];
    }
    $content = "[callblaster]\n";
    $content.= "interval=".$_POST['intervalo'];

    $content.= "\n[press1]\n";
    $content.= "context=".$conte1."\n";
    $content.= "extension=".$_POST['ext1'];
    
    $content.= "\n[press2]\n";
    $content.= "context=".$conte2."\n";
    $content.="extension=".$_POST['ext2']."\n";
     
    file_put_contents("config.ini",$content);
    echo "true";
}
// else {
//   echo "Deve Enviar los paramentros *phoneNumber y *audio " ;
// }
?>