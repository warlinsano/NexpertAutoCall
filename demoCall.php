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

if(!$_POST) {
	// header("Location: http://localhost/Formularios/");
	echo "Deve Enviar los paramentros *phoneNumber y *audio por POST" ;
}

// Si todos los campos se han enviado, entonces, «$post» será «true»,
// de lo contrario será «false»:
$post = (isset($_POST['phoneNumber']) && !empty($_POST['phoneNumber'])) &&
        (isset($_POST['audio']) && !empty($_POST['audio']));


// Si $post es true (verdadero), entonces se mostrarán los resultados:
if ( $post ) {
	require_once 'config.php';

    $phone = $_POST['phoneNumber'];
    $file = $basepath."audio/".$_POST['audio'];

	$exten = pathinfo($file);
	$exten = '.'.$exten['extension'];

	$fileName= $basepath."audio/".basename($file, $exten);

	$callFile = "Channel: local/$phone@from-internal\n";
	$callFile .= "Application: Playback\n";
	$callFile .= "CallerID: $caller_id\n";
	$callFile .= "Data: $fileName\n";
	file_put_contents("/tmp/demoCall.call",$callFile);
	exec("mv /tmp/demoCall.call /var/spool/asterisk/outgoing/demoCall.call");
	// header('Content-type: application/json; charset=utf-8');
	// json_encode($datos, JSON_FORCE_OBJECT);
	//echo "Call initiated al Phone: ". $phone. " con el Audio: ". $file ;
	echo "true";
}
else {
  // Si en cambio, es false (falso), entonces volverá al formulario desde
  // donde se envió la petición:
  //header("Location: ./");
  echo "Deve Enviar los paramentros *phoneNumber y *audio " ;
}


?>
