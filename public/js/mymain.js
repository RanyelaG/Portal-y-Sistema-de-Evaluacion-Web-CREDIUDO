$(document).ready(function() {

	$('.edit-factor').on('click', function(){
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-id').val($(this).data('id'));
	});

	$('.edit-t-instrument').on('click', function(){
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-id').val($(this).data('id'));
		$('#edit-form-category').val($(this).data('category'));
		$('#edit-form-tipo').val($(this).data('tipo'));
	});

	$('.detalle-instrument').on('click', function(){
		$('#detalle-form-id').val($(this).data('id'));
		$('#detalle-form-title').val($(this).data('title'));
		$('#detalle-form-category').val($(this).data('category'));
		$('#detalle-form-enfoque').val($(this).data('enfoque'));
	});

	$('.edit-instrument').on('click', function(){
		$('#edit-form-id').val($(this).data('id'));
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-category').val($(this).data('category'));
		$('#edit-form-tinstrument').val($(this).data('tinstrument'));
	});

	$('.edit-item').on('click', function(){
		$('#edit-form-id').val($(this).data('id'));
		$('#edit-form-name').val($(this).data('name'));
	});
});