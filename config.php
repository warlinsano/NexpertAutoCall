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

//Database configuration
//.............................................
$db_host="localhost";
$db_name="asterisk";
$db_user="root";
$db_pass="qwweee1234";
//.............................................


//caller id and name
$caller_id="<FromWarlinSBCloud>";
//..............................................


//paths
//..............................................

$basepath="/var/www/html/callblaster/";

$agipath="/var/lib/asterisk/agi-bin/";

$welcomeSound = $basepath."audio/welcome";
//sound file without extension
//..............................................



//agi configurations
$config = parse_ini_file("config.ini",true);
$exten_1=$config['press1']['extension'];
$context_1=$config['press1']['context'];
$priority_1="1";


$exten_2=$config['press2']['extension'];
$context_2=$config['press2']['context'];
$priority_2="1";

?>
