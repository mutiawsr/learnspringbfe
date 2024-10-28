$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "http://localhost:9001/api/variant/all",
        contentType: "application/json",
        success: function (response) {
            let responseData = response.data;
            responseData.forEach((variant, index) => {
                $('#variantTable').append(`
                    <tr>
                        <th scope="row" style="text-align: center;">${index + 1}</td>
                        <td style="text-align: center;">${variant.product.category.name}</td>
                        <td style="text-align: center;">${variant.product.name}</td>
                        <td>${variant.name}</td>
                        <td>${variant.slug}</td>
                        <td>${variant.description}</td>
                        <td style="text-align: center;">${variant.price}</td>
                        <td style="text-align: center;">${variant.stock}</td>
                        <td style="text-align: center;">
                            <input type="checkbox" ${variant.isDeleted ? 'checked' : ''} disabled>
                        </td>
                        <td style="text-align: center;">
                            <button class="btn btn-warning" onclick="editForm(${variant.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            <button class="btn btn-danger" onclick="deleteForm(${variant.id})">
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
        url: "/variant/form",
        contentType: "html",
        success: function (productForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("New Variant");
            $('.modal-body').html(productForm);
            loadData();
        }
    });
}

async function loadData() {
    await loadCategory();
    $(document).on('change', '#variantCategory', async function () {
        await loadProduct();
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
                $('#variantCategory').empty().append(`
                    <option value="" selected disabled>Select Category</option>
                `);
                categories.forEach(category => {
                    $('#variantCategory').append(new Option(category.name, category.id));
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

function loadProduct() {
    return new Promise((resolve, reject) => {
        let categoryId = $('#variantCategory').val();
        $.ajax({
            type: "get",
            url: `http://localhost:9001/api/product/category/${categoryId}`,
            contentType: "html",
            success: function (response) {
                let products = response.data;
                $('#variantProduct').empty().append(`
                    <option value="" selected disabled>Select Product</option>
                `);
                products.forEach(product => {
                    $('#variantProduct').append(new Option(product.name, product.id));
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

function addForm() {
    openForm();
    $(document).on('submit', '#variantForm', function (e) {
        e.preventDefault();
        addVariant();
    });
}

function addVariant() {
    let JSONData = {
        name: $('#variantName').val(),
        slug: $('#variantSlug').val(),
        description: $('#variantDesc').val(),
        price: $('#variantPrice').val(),
        stock: $('#variantStock').val(),
        productId: $('#variantProduct').val(),
        isDeleted: $('#variantIsDeleted').prop('checked') ? true : false
    }
    $.ajax({
        type: "post",
        url: "http://localhost:9001/api/variant",
        data: JSON.stringify(JSONData),
        contentType: "application/json",
        success: function () {
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
        url: `http://localhost:9001/api/variant/${id}`,
        contentType: "application/json",
        success: async function (response) {
            let variant = response.data;
            $('.modal-title').html("Edit Variant");
            await loadCategory();
            $('#variantCategory').val(variant.product.category.id);
            await loadProduct();
            $('#variantProduct').val(variant.product.id);
            $('#variantName').val(variant.name);
            $('#variantSlug').val(variant.slug);
            $('#variantDesc').val(variant.description);
            $('#variantPrice').val(variant.price);
            $('#variantStock').val(variant.stock);
            $('#variantIsDeleted').val(variant.isDeleted);
            $('#variantIsDeleted').prop("checked", variant.isDeleted ? true : false);
            $(document).on('submit', '#variantForm', function () {
                e.preventDefault();
                editVariant(id);
            });
        }
    });
}

function editVariant(id) {
    let JSONData = {
        name: $('#variantName').val(),
        slug: $('#variantSlug').val(),
        description: $('#variantDesc').val(),
        price: $('#variantPrice').val(),
        stock: $('#variantStock').val(),
        productId: $('#variantProduct').val(),
        isDeleted: $('#variantIsDeleted').prop('checked') ? true : false
    }
    $.ajax({
        type: "patch",
        url: `http://localhost:9001/api/variant/${id}`,
        data: JSON.stringify(JSONData),
        contentType: "application/json",
        success: function () {
            location.reload();
        },
        error: function (error) {
            alert("Error: Invalid Edit");
            console.error(error);
        }
    });
}

async function deleteForm(id) {
    openForm();
    await $.ajax({
        type: "get",
        url: `http://localhost:9001/api/variant/${id}`,
        contentType: "application/json",
        success: async function (response) {
            let variant = response.data;
            $('.modal-title').html("Delete Variant");
            await loadCategory();
            $('#variantCategory').val(variant.product.category.id);
            $('#variantCategory').prop('disabled', true);
            await loadProduct();
            $('#variantProduct').val(variant.product.id);
            $('#variantProduct').prop('disabled', true);
            $('#variantName').val(variant.name);
            $('#variantName').prop('disabled', true);
            $('#variantSlug').val(variant.slug);
            $('#variantSlug').prop('disabled', true);
            $('#variantDesc').val(variant.description);
            $('#variantDesc').prop('disabled', true);
            $('#variantPrice').val(variant.price);
            $('#variantPrice').prop('disabled', true);
            $('#variantStock').val(variant.stock);
            $('#variantStock').prop('disabled', true);
            $('#variantIsDeleted').val(variant.isDeleted);
            $('#variantIsDeleted').prop("checked", variant.isDeleted ? true : false);
            $('#variantIsDeleted').prop('disabled', true);
            $(document).on('submit', '#variantForm', function () {
                e.preventDefault();
                deleteVariant(id);
            });
        }
    });
}

function deleteVariant(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:9001/api/variant/${id}`,
        contentType: "application/json",
        success: function () {
            location.reload();
        },
        error: function (error) {
            console.error(error);
        }
    });
}