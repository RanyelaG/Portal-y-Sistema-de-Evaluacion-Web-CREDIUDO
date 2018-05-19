$(document).ready(function(){
	

	$('.edit-usuario').on('click', function(){
	   $('#edit-form-cedula').val($(this).data('cedula'))
	   $('#edit-form-direccion').val($(this).data('direccion'))
	   $('#edit-form-email').val($(this).data('email'))
	    $('#edit-form-tmovil').val($(this).data('tmovil'))
	    $('#edit-form-thabitacion').val($(this).data('thabitacion'))
	// body...
    });

$('.fa-pencil').on('click', function(){
	$('#edit-form-codigo').val($(this).data('codigo'))
	   $('#edit-form-informacion').val($(this).data('informacion'))
	   $('#edit-form-nombre').val($(this).data('nombre'))
	  
	   
	// body...
    });
	
});