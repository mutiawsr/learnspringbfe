function openForm() {
    $.ajax({
        type: "get",
        url: "/product/form",
        contentType: "html",
        success: function (productForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("New Product");
            $('.modal-body').html(productForm);
        }
    });
}

function editForm(id) {
    $.ajax({
        type: "get",
        url: `/product/edit/${id}`,
        contentType: "html",
        success: function (productForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("Edit Product");
            $('.modal-body').html(productForm);
        }
    });
}

function deleteForm(id) {
    $.ajax({
        type: "get",
        url: `/product/deleteForm/${id}`,
        contentType: "html",
        success: function (productForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("Delete Product");
            $('.modal-body').html(productForm);
        }
    });
}

function deleteProduct(id) {
    $.ajax({
        type: "get",
        url: `/product/delete/${id}`,
        contentType: "html",
        success: function (response) {
            location.reload();
        }
    });
}