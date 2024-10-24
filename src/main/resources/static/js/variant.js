function openForm() {
    $.ajax({
        type: "get",
        url: "/variant/form",
        contentType: "html",
        success: function (variantForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("New Variant");
            $('.modal-body').html(variantForm);
            loadData();
        }
    });
}

function editForm(id) {
    $.ajax({
        type: "get",
        url: `/variant/edit/${id}`,
        contentType: "html",
        success: function (variantForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("Edit Variant");
            $('.modal-body').html(variantForm);
            loadData();
        }
    });
}

function loadData() {
    let categoryId = $('#categoryId').val();
    let productId = $('#productId').val();
    $('#productId').empty().append(new Option("Select Product", ""));
    if (categoryId) {
        $.ajax({
            type: "get",
            url: '/variant/form/' + categoryId,
            contentType: "html",
            success: function (products) {
                products.forEach(product => {
                    $('#productId').append(new Option(product.name, product.id));
                });
                if (productId) {
                    $("#productId").val(productId).change();
                }
            }
        });
    }

    $('#categoryId').change(function () {
        let categoryId = $(this).val();
        $('#productId').empty().append(new Option("Select Product", ""));
        if (categoryId) {
            $.ajax({
                type: "get",
                url: '/variant/form/' + categoryId,
                contentType: "html",
                success: function (products) {
                    products.forEach(product => {
                        $('#productId').append(new Option(product.name, product.id));
                    });
                }
            });
        }
    });
}

function deleteForm(id) {
    $.ajax({
        type: "get",
        url: `/variant/deleteForm/${id}`,
        contentType: "html",
        success: function (variantForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("Delete Variant");
            $('.modal-body').html(variantForm);
        }
    });
}

function deleteVariant(id) {
    $.ajax({
        type: "get",
        url: `/variant/delete/${id}`,
        contentType: "html",
        success: function () {
            location.reload();
        }
    });
}
