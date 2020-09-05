
  $("#div-config").click(function(){
    Irconfig();
  })	

  $("#div-callAut").click(function(){
    IrLLamadas();
  })	

  $("#div-calLog").click(function(){
    IrHistorial();
  })	

  $("#div-audio").click(function(){
    IrAudio();
  })	

function Irconfig(){
    $('#settingsClik').click();
 };
function IrLLamadas(){
    $('#LLamadasClik').click();
};
function IrHistorial(){
    $('#HistorialClik').click();
};
function IrAudio(){
    $('#audioClik').click();
};
function NoImplementada(){

    Swal.fire(
        'Informacion',
        'Esta funcion pronto estara disponible en las proximas actualizaciones.',
        'info'
      )

};
// Click abrir Reprodducir audio
$(document).on("click",".btnreproducir", function () {
    var link = $(this).attr('link'); 
    $("#Rep_audio").attr("src",link);
    var audio = document.getElementById("Rep_audio");
    audio.play();
    cosyAlert('<strong>Reproduciendo audio</strong><br />', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
 });

// Click abrir modal  de probar llamada
$(document).on("click",".btnProbarLLamada", function () {
    var fileAudioName = $(this).attr('audioName'); 
    $("#modal-ProbarLLamada").modal("show");
    $("#msjValidationPhone").hide();             
    $("#phone").val("");
    $(".fileAudioName").val(fileAudioName);
 });
   
// Click llamar del modal
 $(document).on("click","#btnProbarLLamadaModal", function () {
    var phone = $("#phone").val();
    if(phone==""){
      $("#msjValidationPhone").show();             
    }  
    else if(phone.indexOf("_") > -1){
      $("#msjValidationPhone").show(); 
    }    
    else{
          phone= phone.replace("(","").replace(")","").replace("-","").replace(" ","");
          // $("#msjValidationPhone").hide();             
          var fileAudioName = $("#fileAudioName").val();
          $.ajax({
            type: "POST",
            url: "demoCall.php",
            data: {"phoneNumber": phone, "audio": fileAudioName },
            success: function (data) {
                if(data="true"){
                  $("#modal-ProbarLLamada").modal("hide");
                  cosyAlert('<strong>Llamando!!</strong><br />Llamada en Progreso...', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
                }
                else{
                    // $("#msjValidationPhone").hide(); 
                    cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al probar la llamada, intentelo de nuevo..', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
                    $("#msjValidationPhone").html(data); 
                } 
             },
            error: function(xhr, ajaxOptions, thrownError) {
              //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
              cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al conectar con el servidor, intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
          }
        });
    }
  });

// Click abrir btnOpenUpUploadAudio abrir modal audio
 $(document).on("click",".btnOpenUpUploadAudio", function () {
    $("#modal-UpUploadAudio").modal("show");
    $("#msjValidationAudio").hide();             
    $("#audioFile").val("");
  });

// clik en guardar  audios modal
 $(document).on("click","#btnLSaveAudioModal", function () {
      var audioFile = $("#audioFile").val();

      if(audioFile==""){
        $("#msjValidationAudio").show();             
      }
      else{
        $("#msjValidationAudio").hide();   
        var oTable = $('#tableAudio').DataTable();            
        var property = document.getElementById('audioFile').files[0];
        var form_data = new FormData();
        form_data.append("audioFile",property);
        $.ajax({
          url:'audioAPI.php',
          method:'POST',
          data:form_data,
          contentType:false,
          cache:false,
          processData:false,
          beforeSend:function(){
            //$('#msjValidationAudio').html('Loading......');
            cosyAlert('<strong>Subiendo!!</strong><br />Subiendo audio..', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
          },
          success:function(data){
               //console.log(data);
              //$('#msjValidationAudio').html(data);
              if(data="true"){
                oTable.ajax.reload();
                $("#modal-UpUploadAudio").modal("hide");
                cosyAlert('<strong>Subiendo!!</strong><br />Audio subido correcatmente...', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });         
              }else{
                cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
              }
          },
          error: function(xhr, ajaxOptions, thrownError) {
              //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
              cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al conectar con el servidor, intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
          }
        });           
      }
   });
 
   // Clik en Cancelar Configuaracion
$(document).on("click","#btnLCancelconfig", function () {
  loadConfig();
  $("#msg-intervalo").hide();
  $("#msg-extension1").hide();
  $("#msg-extension2").hide();
  });

// Clik en guardar Configuaracion
$(document).on("click","#btnLSaveconfig", function () {
      var intervalo = $("#intervalo").val();
      var ext_1 = $("#extension1").val();
      var ext_2 = $("#extension2").val();

      validacion =true;

      if(intervalo=="") {
        $("#msg-intervalo").show();
        validacion =false;
      } else{
        $("#msg-intervalo").hide();
      }

      if(ext_1=="") {
        $("#msg-extension1").show();
        validacion =false;
      } else{
        $("#msg-extension1").hide();
      }

      if(ext_2=="") {
        $("#msg-extension2").show();
        validacion =false;
      } else{
        $("#msg-extension2").hide();
      }
      
    if(validacion){
        $.ajax({
          type:'POST',
          url:'UpdateConfig.php',
          data:{"intervalo": intervalo, "ext1": ext_1, "ext2": ext_2, "context":'from-internal'},
          success:function(data){
               //console.log(data);
              //$('#msjValidationAudio').html(data);
              if(data="true"){
                $("#modal-UpUploadAudio").modal("hide");
                cosyAlert('<strong>Guardada!!</strong><br />Configuracion guardado con Exito...', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
              }else{
                cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
              }
          },
          error: function(xhr, ajaxOptions, thrownError) {
              //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
              cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al conectar con el servidor, intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
          }
        });           
      }
   });

// clik en  Subir lista e inicial llamadas
$(document).on("click","#btnUploadcsvFile", function () {
      var csvFile = $("#csvFile").val();
      if(csvFile==""){
        $("#msg-csvFile").show();             
      }
      else{
        $("#msg-csvFile").hide();               
        var property = document.getElementById('csvFile').files[0];
        var form_data = new FormData();
        form_data.append("csvFile",property);
        $.ajax({
          url:'performCalls.php',
          method:'POST',
          data:form_data,
          contentType:false,
          dataType : "json",
          cache:false,
          processData:false,
          beforeSend:function(){
            cosyAlert('<strong>Subiendo!!</strong><br />Subiendo archivo..', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
          },
          success:function(data){
               //console.log(data);
              //$('#msjValidationAudio').html(data);
              //alert(data.data.files);
              if(data.data.estado="true"){
                // $("#modal-UpUploadAudio").modal("hide");
                $("#archivoCsvFile").val(data.data.files); 
                $("#archivoCsvFile").attr("AttrCsvFile",data.data.files); 
                ConsultarProgresoLLamada();
                cosyAlert('<strong>Subiendo!!</strong><br />archivo subido correcatmente...', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
              }else{
                cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
              }
          },
          error: function(xhr, ajaxOptions, thrownError) {
              //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
              cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al conectar con el servidor, intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
          }
        });           
      }
   });

// clik en  boton pausar llamada
  $(document).on("click","#pause-btn", function () {
        chng="";
        var act= $(this).attr('estado'); 
         $.post("control.php",{action:act},function(data){
            if(act=='start'){
              act="pause";
              chng='<i class="fa fa-pause"></i> Pausar'; 
              $("#archivoCsvFile").val($("#archivoCsvFile").attr("AttrCsvFile"));  
              ConsultarProgresoLLamada();            
            }else{
              act="start";
              chng='<i class="fa fa-play"></i> Continuar';
              $("#archivoCsvFile").val(""); 
              Swal.fire(
                  'llamadas Pusadas',
                  'Se han pausado las llamadas, si desesa continuar llamado presione el boton: <b>Continuar</b>, y para detener totalmente presione el boton: <b>Detener</b>',
                  'info'
                )
            }
         $("#pause-btn").attr("estado",act);
         $("#pause-btn").html(chng);
       });
        var msg = (act == "pause" ? "Se han pausado las llamandas" : "Se Continuara llamando");
         cosyAlert('<strong>'+msg+'</strong><br />', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
});
  
 // clik en  boton Detener llamada
  $("#stop-btn").click(function(){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Si continua se detendran todas las llamadas pendientes!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Continuar!'
    }).then((result) => {
      if (result.value) {
        $.post("control.php",{action:'stop'},function(data){
          $("#archivoCsvFile").val(""); 
          $("#archivoCsvFile").attr("AttrCsvFile",""); 
            Swal.fire(
            'Completada!',
            'Se han detenido las llamadas con exito.',
            'success'
          )
          //cosyAlert('<strong>Se han detenido las llamadas</strong><br />', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
        });
      }
    })
});	

 //  Consulta Progreso LLamada para ver en tiempo real
 function ConsultarProgresoLLamada() {
        
    //ejecuta la funcion cada 1 segundo para actualizar de la API
    var tiempo = setInterval(function(){   
         var csvFile = $("#archivoCsvFile").val(); 
        if (csvFile==""){
          clearInterval(tiempo);
        } 
        else{
        //quita las filas de la tabla execto la primera  los titulos 
        $("#tablaProgresoLl tr:gt(0)").remove(); 
        $.ajax({
                type: "GET",
                url: "readLog.php",
                data: {action:"getLog", file:csvFile},
                dataType : "json",
                success: function (data) {
                    if (data.data.length>0) {

                      data.data.forEach(function(elemeneto, index){                  
                          // //elemeneto.fields; 
                          // elemeneto.csvFile;                     
                          var status="";
                            if(elemeneto.status=="Dialling"){           
                                status='<span class="label label-warning">Marcando...</span>';
                              }
                              else if(elemeneto.status=="Connected"){           
                                status='<span class="label label-success">Conectado</span>';                              
                              }
                              else if(elemeneto.status=="Completed"){
                                status='<span class="label label-primary">Completada</span>';
                              }
                              else if(elemeneto.status=="Dialled"){
                                status='<span class="label label-info">Marcada</span>';
                              }
                              else if(elemeneto.status=="Dial Failed"){           
                                status='<span class="label label-danger">Error al marcar</span>';
                              }
                              else{
                                status='<span class="label label-default ">otros</span>';
                              }

                          var opcion="";
                              if(elemeneto.options=="Nil" || elemeneto.options.trim()==""){
                                opcion='Ninguna <i class="fa fa-dot-circle-o text-primary"></i>';
                              }else{
                                opcion='Opccion # '+ elemeneto.options +' <i class="fa fa-check-circle text-success"></i>';
                              }
                          var rows ='';
                          rows =rows + '<tr><td>'+elemeneto.autoID+'</td>';
                          rows =rows + '<td>'+elemeneto.audio+'</td>';
                          rows =rows + '<td>'+elemeneto.phone+'</td>';
                          rows =rows + '<td>'+status+'</td>';
                          rows =rows + '<td>'+opcion+'</td>';
                          rows =rows + '<td>'+elemeneto.time +'</td></tr>';
                          $('#tablaProgresoLl > tbody:last').append(rows);                              
                        });
                    }
                    //agrega la fila a la tfoot
                    $('#tablaProgresoLl > tfoot:last').append(`
                        <tr>
                          <th>ID</th>
                          <th>Audio</th>
                          <th>Telefono</th>
                          <th>Estado</th>
                          <th>Opcion Marcada</th>
                          <th>Tiempo</th>
                      </tr>`);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                  cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al cargar el progreso en tiempo real...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
                }
              });
            }
       },1000);
};

//cargar Configuraciones
function loadConfig(){
    $.ajax({
        type: "GET",
        url: "UpdateConfig.php",
        data: {id:" "},
        dataType : "json",
        success: function (data) {
            if (data.data.length>0) {
                $("#intervalo").val(data.data[0].interval);
                $("#extension1").val(data.data[0].extension1);
                $("#extension2").val(data.data[0].extension2);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error cargar la configuracion por favor vuelva a cagar la pagina...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
        }
    });
    var year = (new Date).getFullYear();
    $("#year").text(year);
}

$(document).ready(function () {

    $('#tableHistorial').DataTable({
        "bLengthChange": true,    
        responsive: true,
        language: {
            processing: "Procesando",
            search: "Buscar:",
            lengthMenu: "Ver _MENU_ Filas",
            info: "_START_ - _END_ de _TOTAL_ elementos",
            infoEmpty: "0 - 0 de 0 elementos",
            infoFiltered: "(Filtro de _MAX_ entradas en total)",
            infoPostFix: "",
            loadingRecords: "Cargando datos.",
            zeroRecords: "No se encontraron datos",
            emptyTable: "No hay datos disponibles",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            aria: {
                sortAscending: ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
        },
        "ajax": {
            "type": "Get",
            "url": "logAPI.php",
            "datatype": "JSON"
        },
        "pageLength": 10,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todas"]],
        "columns": [
            { "data": "numero" },
            {
              "data": "nombre", "render": function (data, type, row, meta) {
                     return '<i class="fa fa-file-excel-o text-green"></i>' + row["nombre"] ;                    
                  }
            },
            { "data": "fechaCreacion" },
            { "data": "peso" },         
            {
              "data": "link", "autoWidth": true, "class": "tabla", "render": function (data, type, row, meta) {
                    return ' <a class="btn btn bg-olive margin" id="" href="' + row['link'] + '"><li class="fa fa-arrow-circle-down"></li> Descargar</a>';
                } 
            }
        ]
    });

    $('#tableAudio').DataTable({
        "bLengthChange": true,
        responsive: true,
        language: {
            processing: "Procesando",
            search: "Buscar:",
            lengthMenu: "Ver _MENU_ Filas",
            info: "_START_ - _END_ de _TOTAL_ elementos",
            infoEmpty: "0 - 0 de 0 elementos",
            infoFiltered: "(Filtro de _MAX_ entradas en total)",
            infoPostFix: "",
            loadingRecords: "Cargando datos.",
            zeroRecords: "No se encontraron datos",
            emptyTable: "No hay datos disponibles",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            aria: {
                sortAscending: ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
        },
        "pageLength": 10,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todas"]],
        "ajax": {
            "type": "Get",
            "url": "audioAPI.php",
            "datatype": "JSON"
        },
        "columns": [
            { "data": "numero" },
            {
              "data": "nombre", "render": function (data, type, row, meta) {
                     return '<i class="fa fa-volume-up"></i>' + row["nombre"] ;                    
                  }
            },
            { "data": "fechaCreacion" },
            {
              "data": "link", "autoWidth": true, "class": "tabla", "render": function (data, type, row, meta) {
                    return ' <a class="btn btn-primary btnreproducir" link="'+row["link"]+'"><li class="fa fa-play"></li> Reproducir</a> |<a class="btn btn bg-olive margin" id="" href="'+row["link"]+'"  download="'+row["nombre"]+'"><li class="fa fa-arrow-circle-down"></li> Descargar</a>| <a class="btn btn-warning btnProbarLLamada" audioName="'+row["nombre"]+'" ><li class="fa fa-phone"></li> LLamada De Prueba</a>';
                } 
            }
        ]
    });
    
    $('[data-mask]').inputmask();

    loadConfig();
});

