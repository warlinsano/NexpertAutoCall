
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

// Click abrir btnOpenAddCamp abrir modal agregar campaña
 $(document).on("click",".btnOpenAddCamp", function () {
  
  $("#modal-addcamp").modal("show");

  $("#nameCamp").val("");
  $("#InicioCamp").val("");
  $("#FinCamp").val("");
  $("#HoraInicioCamp").val("");
  $("#HoraFinCamp").val("");

  $("#msgModalCamp").hide();
});

// Click para abrir el modal de subir contctos de campaña
$(document).on("click",".btnSubirContacto", function () {

  var id = $(this).attr('keycamp'); 
  $("#CampIdcsv").val(id);

  $("#modal-UpUploadConct").modal("show");
  $("#msjValidationContactos").hide();             
  $("#ContactoFile").val("");  
});

// clik en  Subir CSV Contacto de compaña 
$(document).on("click","#btnSubircsvConctacto", function () {
  var csvFile = $("#ContactoFile").val();
  var key = $("#CampIdcsv").val();

  if(csvFile==""){
    $("#msjValidationContactos").show();             
  }
  else{
    $("#msjValidationContactos").hide();               
    var property = document.getElementById('ContactoFile').files[0];
    // var key = document.getElementById('CampIdcsv').files[0];
    
    var form_data = new FormData();
    form_data.append("ContactoFile",property);
    form_data.append("idcamp",key);

    $.ajax({
      url:'InsertConct.php',
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
        //  alert(data.data.mensaje);
          if(data.data.estado="true"){
            $("#modal-UpUploadConct").modal("hide");
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

// Click boton camabiar estado de la campaña
$(document).on("click",".cambiarEstatus", function () {
 
  var  key  = $(this).attr('key'); 
  var  estado = $(this).attr('estatus'); 
  var  Textestado =  (estado=='I'?'Activar':'Desactivar');
  var  inverEstado =  (estado=='I'?'A':'I');

  Swal.fire({
    title: '¿Desea '+Textestado+' la campaña?',
    text: Textestado,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si'
  }).then((result) => {
    if (result.isConfirmed) {
          $.ajax({
            type: "GET",
            url: "campAPI.php",
            data: {status:inverEstado, id:key, action:"CambiarEstado"},
            dataType : "json",
            success: function (data) {
               // alert(data.data);
                var oTable = $('#tableCamp').DataTable();   
                oTable.ajax.reload();

                Swal.fire(
                  'Cambiado!',
                  'Es estado fue cambiado con exito.',
                  'success'
                )            
            },
            error: function(xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error ...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
            }
        });
    }
  })

});

// Click boton eliminar Campaña
$(document).on("click",".btnElimarComp", function () {
 
  var key = $(this).attr('Key'); 

  Swal.fire({
    title: '¿Estás seguro de eliminarla?',
    text: "¡No podrás revertir esta accion!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminalo!'
  }).then((result) => {
    if (result.isConfirmed) {
          $.ajax({
            type: "GET",
            url: "campAPI.php",
            data: {id:key, action:"DelteCamp"},
            dataType : "json",
            success: function (data) {
              // if(data.data=="1"){
                var oTable = $('#tableCamp').DataTable();   
                oTable.ajax.reload();

                Swal.fire(
                  'Eliminado!',
                  'La campaña ha sido eliminado con exicto.',
                  'success'
                ) 
              // }else{
              //   cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error ...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
              // }               
            },
            error: function(xhr, ajaxOptions, thrownError) {
            //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error ...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
            }
        });

    }
  })

});

// Clik en guardar Campaña modal
$(document).on("click","#btnLSaveCamp", function () {

  var name = $("#nameCamp").val().trim();
  var inicio = $("#InicioCamp").val();
  var fin = $("#FinCamp").val();
  var horaInico = $("#HoraInicioCamp").val();
  var horaFin = $("#HoraFinCamp").val();

  validacion =true;
  $("#msgModalCamp").html("");
  $("#msgModalCamp").hide();

  if(horaFin=="") {
    $("#msgModalCamp").show();
    $("#msgModalCamp").html("Deve selecionar la hora de finalizacion");
    validacion =false;
  } 

  if(horaInico=="") {
    $("#msgModalCamp").show();
    $("#msgModalCamp").html("Deve selecionar la hora de inicio");
    validacion =false;
  } 

  if(fin=="") {
    $("#msgModalCamp").show();
    $("#msgModalCamp").html("Deve selecionar la fecha de fin");
    validacion =false;
  } 
  
  if(inicio=="") {
    $("#msgModalCamp").show();
    $("#msgModalCamp").html("Deve selecionar la fecha de inicio");
    validacion =false;
  } 

  if(name=="") {
    $("#msgModalCamp").show();
    $("#msgModalCamp").html("Deve llenar el campo nombre");
    validacion =false;
  } 
  
if(validacion){
    $.ajax({
      type:'POST',
      url:'campAPI.php',
      data:{"name": name, "inicio": inicio, "fin": fin, "horaInico": horaInico, "horaFin": horaFin, "context":'from-internal'},
      success:function(data){
          if(data.data==true){
            $("#modal-addcamp").modal("hide");
            var oTable = $('#tableCamp').DataTable();   
            oTable.ajax.reload();
            cosyAlert('<strong>Guardada!!</strong><br />Campaña agregada con Exito...', 'success', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });
          }else{
            //  alert(data.errMsg);
            $("#msgModalCamp").html(data.errMsg);
            $("#msgModalCamp").show();
          }
      },
      error: function(xhr, ajaxOptions, thrownError) {
          //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
          cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error al conectar con el servidor, intentelo de nuevo...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
      }
    });           
  }
});

// Click boton eliminar audio
$(document).on("click",".btnElimarAudio", function () {
 
    var audio = $(this).attr('nombre'); 

    Swal.fire({
      title: '¿Estás seguro de eliminarlo?',
      text: "¡No podrás revertir esta accion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.isConfirmed) {
            $.ajax({
              type: "GET",
              url: "audioAPI.php",
              data: {nameaudio:audio, action:"Delteaudio"},
              dataType : "json",
              success: function (data) {
                var oTable = $('#tableAudio').DataTable();   
                oTable.ajax.reload();

                Swal.fire(
                  'Eliminado!',
                  'Tu archivo ha sido eliminado con exicto.',
                  'success'
                )                
              },
              error: function(xhr, ajaxOptions, thrownError) {
              //console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
              cosyAlert('<strong>Error!!</strong><br/>Ha ocurrido un error ...', 'error', { showTime: 1000, hideTime: 1000, vPos: 'bottom', hPos: 'right' });            
              }
          });

      }
    })
  
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
                    return ' <a class="btn btn-primary btnreproducir" link="'+row["link"]+'"><li class="fa fa-play"></li> Reproducir</a> |<a class="btn btn bg-olive margin" id="" href="'+row["link"]+'"  download="'+row["nombre"]+'"><li class="fa fa-arrow-circle-down"></li> Descargar</a>| <a class="btn btn-danger btnElimarAudio" nombre="'+row["nombre"]+'"><li class="fa fa-trash"></li> Eliminar</a>| <a class="btn btn-warning btnProbarLLamada" audioName="'+row["nombre"]+'" ><li class="fa fa-phone"></li> LLamada De Prueba</a>';
                } 
            }
        ]
    });
    
    $('#tableCamp').DataTable({
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
            "url": "campAPI.php?action=getLog",
            "datatype": "JSON"
        },
        "columns": [
            { "data": "name" },
            {
                "data": "datetime_init", "render": function (data, type, row, meta) {
                       return  row["datetime_init"] +'<br>' + row["datetime_end"] ;                    
                    }
            },
            {
                "data": "daytime_init", "render": function (data, type, row, meta) {
                       return  row["daytime_init"] +'<br>' + row["daytime_end"] ;                    
                    }
            },
            { "data": "retries" },
            { "data": "trunk" },
            { "data": "queue" },
            { "data": "num_completadas" },
            { "data": "promedio" },
            {
              "data": "estatus", "render": function (data, type, row, meta) {
                     return  row["estatus"] =='A'?'<span estatus="'+row["estatus"]+'"  key="'+row["id"]+'" class="label label-success cambiarEstatus">Activo</span>':'<span estatus="'+row["estatus"]+'" key="'+row["id"]+'"  class="label label-danger cambiarEstatus">Inactivo</span>';                    
                  }
            },
            {
              "data": "estatus", "autoWidth": true, "class": "tabla", "render": function (data, type, row, meta) {
                    return ' <a class="btn btn-primary btnSubirContacto" keyCamp="'+row["id"]+'"><li class="fa  fa-arrow-circle-up"></li> Subir</a> |<a class="btn btn bg-olive margin" id="" href="InsertConct.php?id='+row["id"]+'"  ><li class="fa fa-arrow-circle-down"></li> Descargar</a>| <a class="btn btn-danger btnElimarComp" Key="'+row["id"]+'"><li class="fa fa-trash"></li> Eliminar</a>';
                } 
            }
        ]
    });
    
    $('[data-mask]').inputmask();

    loadConfig();
});

