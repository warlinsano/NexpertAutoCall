<?php
 require_once("config.php");
 $errMsg = "";

//Conexion de a la DB de Call_Center
$connection = mysql_connect($db_host,$db_user,$db_pass) or die("ERROR connecting to Server");
$bd_seleccionada = mysql_select_db($db, $connection); // mysql_select_db($db) or die("Error connecting to database");
if (!$bd_seleccionada) {
    $errMsg = "Error al conectar a la DB ";
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

//Descargar el CSV data
if(isset($_REQUEST['id']))
{
	$id = $_REQUEST['id'];
	header('Content-type: text/csv');
	header("Content-disposition: attachment;filename=Data.csv");
	
	$query = "select * from calls where id_campaign=$id ";
	$result = mysql_query($query);
  $ret='';
	if($result and mysql_num_rows($result)>0)
	{
    $ret.="Numero,Status,DNC";
    while ($row = mysql_fetch_assoc($result)) {
      $ret.="\n";
			$ret.=$row['phone'].",".$row['status'].",".$row['dnc'];		
    }			
  }
  echo $ret;

}elseif(!isset($_FILES['ContactoFile']) or $_FILES['ContactoFile']['error']>0)
{
    // header('Status: 301 Moved Permanently', false, 301);
    // header('Location: index.php');
    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo '{ "data":{ "estado": "false",  "files":"", "mensaje":"Error al subir el archivo" }} ';
    // exit(); 
}
//Subir lista de contactos
else
{
  if(isset($_POST['idcamp']) && !empty($_POST['idcamp'])){
      $ts=time();
      $dest = $basepath."files/".$ts.$_FILES['ContactoFile']['name'];
    if(move_uploaded_file($_FILES['ContactoFile']['tmp_name'],$dest)){
      
        //$fila = 1;
        if (($fp = fopen($dest, "r")) !== FALSE) {
        $id_campaign = $_POST['idcamp'];

        // $id_campaign = 37;
        while ( ($data = fgetcsv ($fp, 1000, ";"))!== FALSE) {
        // $numero = count($datos);
        //  echo "<p> $numero de campos en la línea $fila: <br /></p>\n";
        //  $fila++;
        //  for ($c=0; $c < $numero; $c++) {
        //      echo $datos[$c] . "<br />\n";
        //  }
            $query ="INSERT INTO calls (phone, id_campaign) VALUES ('$data[0]', $id_campaign)";
            $result = mysql_query($query);	
            if (!$result) {          
              }           
          }
          fclose ($fp);
          header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
          echo '{ "data":{ "estado": "true",  "files":"'.urlencode($dest).'", "mensaje":"subido con exito" }} ';
      }
    }
  }
  else{
    header('Content-type: application/json; charset=utf-8');     // json_encode($datos, JSON_FORCE_OBJECT);
    echo '{ "data":{ "estado": "false",  "files":"", "mensaje":"falta en key de la campaña" }} ';
  }
}
// // $conexion=pg_connect("host=localhost port=5432 user=postgres password=prestaciones dbname=prueba");
// if(isset($_POST['btnSubircsvConctacto']))
// {}
   ?>