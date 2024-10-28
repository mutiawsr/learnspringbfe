$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "http://localhost:9001/api/product/all",
        contentType: "application/json",
        success: function (response) {
            let responseData = response.data;
            responseData.forEach((product, index) => {
                $('#productTable').append(`
                    <tr>
                        <th scope="row" style="text-align: center;">${index + 1}</td>
                        <td>${product.category.name}</td>
                        <td>${product.name}</td>
                        <td>${product.slug}</td>
                        <td>${product.description}</td>
                        <td style="text-align: center;">
                            <input type="checkbox" ${product.isDeleted ? 'checked' : ''} disabled>
                        </td>
                        <td style="text-align: center;">
                            <button class="btn btn-warning" onclick="editForm(${product.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            <button class="btn btn-danger" onclick="deleteForm(${product.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    });
})

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

function loadCategory() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "http://localhost:9001/api/category/all",
            contentType: "html",
            success: function (response) {
                let categories = response.data;
                categories.forEach(category => {
                    $('#productCategory').append(new Option(category.name, category.id));
                });
                resolve();
            },
            error: function (error) {
                console.error(error);
                reject();
            }
        });
    })
}

async function addForm() {
    openForm();
    await loadCategory();
    $(document).on('submit', '#productForm', function (e) {
        e.preventDefault();
        addProduct();
    });
}

function addProduct() {
    let JSONData = {
        name: $('#productName').val(),
        slug: $('#productSlug').val(),
        description: $('#productDesc').val(),
        categoryId: $('#productCategory').val(),
        isDeleted: $('#productIsDeleted').prop('checked') ? true : false
    }
    $.ajax({
        type: "post",
        url: "http://localhost:9001/api/product",
        data: JSON.stringify(JSONData),
        contentType: "application/json",
        success: function (response) {
            location.reload();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

async function editForm(id) {
    openForm();
    await $.ajax({
        type: "get",
        url: `http://localhost:9001/api/product/${id}`,
        contentType: "application/json",
        success: async function (response) {
            let product = response.data;
            $('.modal-title').html("Edit Product");
            await loadCategory();
            $('#productCategory').val(product.category.id);
            $('#productName').val(product.name);
            $('#productSlug').val(product.slug);
            $('#productDesc').val(product.description);
            $('#productIsDeleted').val(product.isDeleted);
            $('#productIsDeleted').prop("checked", product.isDeleted ? true : false);
            $(document).on('submit', '#productForm', function (e) {
                e.preventDefault();
                editProduct(id);
            });
        }
    });
}

function editProduct(id) {
    let JSONData = {
        name: $('#productName').val(),
        slug: $('#productSlug').val(),
        description: $('#productDesc').val(),
        categoryId: $('#productCategory').val(),
        isDeleted: $('#productIsDeleted').prop('checked') ? true : false
    }
    $.ajax({
        type: "patch",
        url: `http://localhost:9001/api/product/${id}`,
        data: JSON.stringify(JSONData),
        contentType: "application/json",
        success: function (response) {
            location.reload();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

async function deleteForm(id) {
    openForm();
    await $.ajax({
        type: "get",
        url: `http://localhost:9001/api/product/${id}`,
        contentType: "application/json",
        success: async function (response) {
            let product = response.data;
            $('.modal-title').html("Delete Product");
            await loadCategory();
            $('#productCategory').val(product.category.id);
            $('#productCategory').prop("disabled", true);
            $('#productName').val(product.name);
            $('#productName').prop("disabled", true);
            $('#productSlug').val(product.slug);
            $('#productSlug').prop("disabled", true);
            $('#productDesc').val(product.description);
            $('#productDesc').prop("disabled", true);
            $('#productIsDeleted').prop("checked", product.isDeleted ? true : false);
            $('#productIsDeleted').prop("disabled", true);
            $(document).on('submit', '#productForm', function (e) {
                e.preventDefault();
                deleteProduct(id);
            });
        }
    });
}

function deleteProduct(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:9001/api/product/${id}`,
        contentType: "application/json",
        success: function () {
            location.reload();
        },
        error: function (error) {
            console.error(error);
        }
    });
}