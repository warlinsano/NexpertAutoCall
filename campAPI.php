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

// $validar = (isset($_GET['file']) && !empty($_GET['file']));
// if($validar){
// require_once('config.php');
//https://192.99.111.247/callblaster/campAPI.php?action=getLog
//https://192.99.111.247/callblaster/campAPI.php?action=CambiarEstado&id=1&status=A

require_once("config.php");


//Conexion de a la DB de Call_Center
$connection = mysql_connect($db_host,$db_user,$db_pass) or die("ERROR connecting to Server");
$bd_seleccionada = mysql_select_db($db, $connection); // mysql_select_db($db) or die("Error connecting to database");
if (!$bd_seleccionada) {
    die ('Error al conectar a la DB ');      
}

//GET 
if(!$_POST) {
    //Listar Todos
	if($_REQUEST['action']=="getLog")
	{  
        $query = "SELECT * FROM campaign";
		$result = mysql_query($query);
		
		if (!$result) {
			die('Consulta no válida: ' . mysql_error());
		}
		$contador=0;
		$jsondata = '{ "data": [';  
		while ($fila = mysql_fetch_assoc($result)) {

            $trunk = $fila['trunk'] =="" ? "N/A" : $fila['trunk'];
            $num_completadas = $fila['num_completadas'] =="" ? "N/A" : $fila['num_completadas'];
            $promedio = $fila['promedio'] =="" ? "N/A" : $fila['promedio'];

			if($contador!= 0){ $jsondata.=','; }
			$jsondata.='{'; 
			$jsondata.=' "id": '.$fila['id'].','; 
			$jsondata.=' "name": "'.utf8_decode($fila['name']).'",' ;
			$jsondata.=' "trunk": "'.$trunk.'",';
			$jsondata.=' "type": "'.$fila['type'].'",' ;
			$jsondata.=' "context": "'.$fila['context'].'",' ;
            $jsondata.=' "datetime_init": "'.$fila['datetime_init'].'",' ;
            $jsondata.=' "datetime_end": "'.$fila['datetime_end'].'",' ;
            $jsondata.=' "daytime_init": "'.$fila['daytime_init'].'",' ;
            $jsondata.=' "daytime_end": "'.$fila['daytime_end'].'",' ;       
            $jsondata.=' "retries": "'.$fila['retries'].'",' ;
            $jsondata.=' "promedio": "'.$promedio.'",' ;
            $jsondata.=' "num_completadas": "'.$num_completadas.'",' ;
            $jsondata.=' "queue": "'.$fila['queue'].'",' ;
            $jsondata.=' "estatus": "'.$fila['estatus'].'",' ;
            $jsondata.=' "max_canales": "'.$fila['max_canales'].'",' ;
            $jsondata.=' "id_url": "'.$fila['id_url'].'"' ;
			$jsondata.= '}';  
			$contador++;          			
		}
		$jsondata.= '] }' ;  
		//Aunque el content-type no sea un problema en la mayoría de casos, es recomendable especificarlo
		header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
		echo  $jsondata;
		exit();
    }
    //Eliminar Campaña
    elseif(isset($_REQUEST['action']) && $_REQUEST['action']=="DelteCamp" ){
        
        $errMsg='';
        $responce = false;
        $id =intval($_REQUEST['id']);  
        if(isset($_REQUEST['id']) && !empty($_REQUEST['id'])){
            $responce = delete_campaign($id);
        }
        
        header('Content-type: application/json; charset=utf-8');     
        echo '{"data":'.$responce.', "errMsg": "'.$errMsg.'" }';
        exit(); 
    }
    //Cambiar estado Campaña
    elseif(isset($_REQUEST['action']) && $_REQUEST['action']=="CambiarEstado" ){
        
        $errMsg='';
        $responce = true;
        if(isset($_REQUEST['status']) && !empty($_REQUEST['status'])){

            $id = intval($_REQUEST['id']);  
            $estado = $_REQUEST['status'];  
            $query = "UPDATE campaign SET estatus = '$estado' WHERE id = $id";
            $result = mysql_query($query);
            
            if ($result) {
                $responce = true;
            }
        }
        
        header('Content-type: application/json; charset=utf-8');     
        echo '{"data":"'.$responce.'", "Msg": "'.$errMsg.'" }';
        exit(); 
    }  
    //No se envio parametro..
    else{
        header('Content-type: application/json; charset=utf-8');    
        echo "{De ve enviar los parametros por el metodo http GET}";
        exit();
    }
}

//POST
//validacion
$post = (isset($_POST['name']) && !empty($_POST['name'])) &&
        (isset($_POST['inicio']) && !empty($_POST['inicio'])) &&
        (isset($_POST['fin']) && !empty($_POST['fin'])) &&
        (isset($_POST['horaFin']) && !empty($_POST['horaFin'])) &&
        (isset($_POST['horaInico']) && !empty($_POST['horaInico']));

define('REGEXP_FECHA_VALIDA', '/^\d{4}-\d{2}-\d{2}$/');
define('REGEXP_HORA_VALIDA', '/^\d{2}:\d{2}$/');

if ($post) {

    $sNombre = trim($_POST['name']);
    $sFechaInicial = trim($_POST['inicio']);
    $sFechaFinal = trim($_POST['fin']);
    $sHoraInicio = trim($_POST['horaInico']);
    $sHoraFinal = trim($_POST['horaFin']);
    $sContext = 'from-internal';
    $sQueue = '1000';
    $script = '<style type="text/css">body {background: #FFF;}</style>';
   
    $errMsg ='';
    $validar = true;

    if ($sNombre == '') {
        $errMsg = 'Nombre de campaña no puede estar vacío';
        $validar = false; 
    } elseif (!preg_match(REGEXP_FECHA_VALIDA, $sFechaInicial)) {
        $errMsg = 'Fecha de inicio no es válida (se espera yyyy-mm-dd)';
        $validar = false;
    } elseif (!preg_match(REGEXP_FECHA_VALIDA, $sFechaFinal)) {
        $errMsg = 'Fecha de final no es válida (se espera yyyy-mm-dd)';
        $validar = false;
    } elseif ($sFechaInicial > $sFechaFinal) {
        $errMsg = 'Fecha de inicio debe ser menol a la fecha final';
        $validar = false;
    } elseif (!preg_match(REGEXP_HORA_VALIDA, $sHoraInicio)) {
        $errMsg = 'Hora de inicio no es válida (se espera hh:mm)';
        $validar = false;
    } elseif (!preg_match(REGEXP_HORA_VALIDA, $sHoraFinal)) {
        $errMsg = 'Hora de final no es válida (se espera hh:mm)';
        $validar = false;
    } elseif (strcmp($sFechaInicial,$sFechaFinal)==0 && strcmp ($sHoraInicio,$sHoraFinal)>=0) {
        $errMsg = 'Hora de inicio debe ser menor a la hora final';
        $validar = false;
    }else {
        // Verificar que el nombre de la campaña es único
        $query = "SELECT * FROM campaign WHERE name = '$sNombre' ";
        $result = mysql_query($query);	
        if (!$result) {
           $errMsg = 'Error al Consulta con la base de datos intente de nuevo';
           $validar = false;
        }
         // Ya existe una campaña duplicada
        if (mysql_fetch_assoc($result) > 0) {
            $errMsg = 'Nombre de campaña indicado ya esta en uso';
            $validar = false;
        }else{
            // Construir y ejecutar la orden de inserción SQL
            $query = "INSERT INTO campaign 
                    (
                        name,
                        context, 
                        queue,
                        datetime_init,
                        datetime_end,
                        daytime_init,
                        daytime_end, 
                        script 
                    )
                VALUES 
                    (
                        '$sNombre',
                        '$sContext', 
                        '$sQueue',
                        '$sFechaInicial',
                        '$sFechaFinal', 
                        '$sHoraInicio',
                        '$sHoraFinal',
                        '$script'
                    )";
            $result = mysql_query($query);

            if (!$result) {
             $errMsg = 'Error al guardar intente de nuevo';
             $validar = false;
            }
        }
    }

	header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo '{"data":"'.$validar.'", "errMsg": "'.$errMsg.'" }';
    exit(); 
}
else{
    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo '{"data":false}';
    exit(); 
}

/**
     * Procedimiento para crear una nueva campaña, vacía e inactiva. Esta campaña
     * debe luego llenarse con números de teléfono en sucesivas operaciones.
     *
     * @param   $sNombre            Nombre de la campaña
     * @param   $iMaxCanales        Número máximo de canales a usar simultáneamente por campaña
     * @param   $iRetries           Número de reintentos de la campaña, por omisión 5
     * @param   $sTrunk             troncal por donde se van a realizar las llamadas (p.ej. "Zap/g0")
     * @param   $sContext           Contexto asociado a la campaña (p.ej. 'from-internal')
     * @param   $sQueue             Número que identifica a la cola a conectar la campaña saliente (p.ej. '402')
     * @param   $sFechaInicio       Fecha YYYY-MM-DD en que inicia la campaña
     * @param   $sFechaFinal        Fecha YYYY-MM-DD en que finaliza la campaña
     * @param   $sHoraInicio        Hora del día (HH:MM militar) en que se puede iniciar llamadas
     * @param   $sHoraFinal         Hora del día (HH:MM militar) en que se debe dejar de hacer llamadas
     * @param   $script             Texto del script a recitar por el agente
     * @param   $id_url             NULL, o ID del URL externo a cargar
     *
     * @return  int    El ID de la campaña recién creada, o NULL en caso de error
     */

        //Carga de colas entrantes activas
        // $recordset = $this->_DB->fetchTable("SELECT queue FROM queue_call_entry WHERE estatus='A'");
        // if (!is_array($recordset)) {
        //     $errMsg = '(internal) Failed to query active incoming queues'.
        // 	return NULL;
        // }
        // $colasEntrantes = array();
        // foreach ($recordset as $tupla) $colasEntrantes[] = $tupla[0]; 
        // if ($sTrunk == '') $sTrunk = NULL;

        //  elseif (in_array($sQueue, $colasEntrantes)) {
        //     $errMsg = 'Queue is being used, choose other one';//La cola ya está siendo usada, escoja otra
        // } 
        
        // $id_campaign = mysql_insert_id();
        // if ($id_campaign === FALSE) {
            
        // } else {
        //     // $this->errMsg = $this->_DB->errMsg;
    // }
        


function delete_campaign($idCampaign)
{
  include("config.php");
  $conex = new mysqli($db_host,$db_user,$db_pass, $db);
  $conex->autocommit(false);

    if (!$conex) {
        return FALSE;
    }

    try {
        $conex->query("DELETE FROM campaign_form WHERE id_campaign = $idCampaign");
        $conex->query("DELETE FROM call_recording WHERE id_call_outgoing IN (SELECT id from calls WHERE id_campaign = $idCampaign)");
        $conex->query("DELETE FROM call_attribute WHERE id_call IN (SELECT id from calls WHERE id_campaign = $idCampaign)");
        $conex->query("DELETE FROM form_data_recolected WHERE id_calls IN (SELECT id from calls WHERE id_campaign = $idCampaign)");
        $conex->query("DELETE call_progress_log FROM call_progress_log, calls WHERE call_progress_log.id_call_outgoing = calls.id AND calls.id_campaign = $idCampaign");
        $conex->query("DELETE FROM calls WHERE id_campaign = $idCampaign");
        $conex->query("DELETE FROM campaign WHERE id = $idCampaign");

        $conex->commit();
        $conex->close();
        return TRUE;
    } catch (Exception $e) {
        $conex->rollback();
        // echo 'Something fails: ',  $e->getMessage(), "\n";
        return FALSE;
    }
    return FALSE;
}

?>



<?php
//$conexion=pg_connect("host=localhost port=5432 user=postgres password=prestaciones dbname=prueba");
//if(isset($_POST['submit'])) {


// Recoge el nombre del fichero que se habrá indicado en el formulario
//$fichero = $_FILES["fichero"]["name"];
// Recoge la ubicación temporal del fichero en el servidor
//$fichero_tmp = $_FILES["fichero"]["tmp_name"];
// Comprueba que se ha indicado un fichero en el formulario
// if ($fichero == "") {
// echo "¡Error! No se ha especificado ningún fichero\n";
// return;
// }
 
// // Ruta completa (incluido el nombre del fichero), necesaria para usar fopen; hemos creado una carpeta denominada ficheros
// //La carpeta ficheros está en la misma ubicación que el script
// $destino = "./ficheros/" . $fichero;
 
// // Copia el fichero al directorio de nuestro servidor, cogiéndolo de la ubicación temporal
// if (move_uploaded_file($fichero_tmp, $destino)) {
// echo "El fichero se ha subido al servidor correctamente\n";
// }
// else {
// echo "Se ha producido un error al subir el fichero\n";
// }

   // // NO ES CORRECTO $fichero =$_POST['fichero'];
    //  $handle = fopen("$destino", "r");
    //  while (($data = fgetcsv($handle, 18192, ";")) !== FALSE)
    //  {
   
     // // Verificar que el nombre de la campaña es único
    //   $query = "SELECT * FROM campaign WHERE name = '$sNombre' ";
    //   $result = mysql_query($query);	
    //     if (!$result) {
    //        $errMsg = 'Error al Consulta con la base de datos intente de nuevo';
    //        $validar = false;
    //     }

     /*  $import="INSERT INTO prueba (id_prueba,montoneto,montodisponible) VALUES ('$data[0]','$data[1]','$data[2]')";
      pg_query($import) or die(pg_last_error()); */
//      echo 'Obtenidos los datos: '. $data[0].', '. $data[1].' ,'. $data[2];
//        var_dump($data);

//      }
//      fclose($handle);
//      print "Import done";
//    }
//    else
//    {
 
//       print "<form action='enviar_csv.php' enctype='multipart/form-data' method='post' >";
//       print "Type file name <strong class='highlight'>to</strong> import:<br>";
       
//       print "<input type='file' name='fichero' size='20'><br>";
//       print "<input type='submit' name='submit' value='submit'></form>";
//    }
  ?>