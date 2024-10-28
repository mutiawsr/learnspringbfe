let selectedProduct = [];
let grandTotal = 0;
let grandTotalQuantity = 0;

function newTransaction() {
    let reference = Date.now();
    
    $('#reference-input').val(reference);
    $('#newTransactionBtn').prop('disabled', 'true');
    $('#newOrderBtn').prop('disabled', false);
    $('#paymentBtn').prop('disabled', false);

    let JSONData = {
        reference: reference,
        amount: 0,
        isDeleted: false
    }
    
    $.ajax({
        type: "post",
        url: "http://localhost:9001/api/orderheaders",
        data: JSON.stringify(JSONData),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function makePayment(reference) {
    let paymentReference = reference;
    let paymentBill =  $('#transactionBill').val();
    
    let paymentJSON = {
        reference: paymentReference,
        amount: paymentBill,
        isDeleted: false
    }
    
    $.ajax({
        type: "patch",
        url: `http://localhost:9001/api/orderheaders/${reference}`,
        data: JSON.stringify(paymentJSON),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            $.ajax({
                type: "post",
                url: `http://localhost:9001/api/orderdetails/${reference}/all`,
                data: JSON.stringify(selectedProduct),
                contentType: "application/json",
                success: function (response) {
                    console.log(response);
                    showTransactionSuccess();
                }
            });
        },
        error: function (error) {
            console(error);
        }
    });
}

function showTransactionSuccess() {
    $.ajax({
        type: "get",
        url: "/transaction/successForm",
        contentType: "html",
        success: function (successForm) {
            let transactionReference = $('#transactionReference').val();
            let transactionBill = $('#transactionBill').val();
            let transactionPayment = $('#transactionPayment').val();
            let transactionChange = $('#transactionChange').val();
            $('.modal-title').html("Payment Success");
            $('.modal-body').html(successForm);
            $('.modal-header').css('background-color', '#4cc28b');
            $('#successReference').val(transactionReference);
            $('#successBill').val(transactionBill);
            $('#successPayment').val(transactionPayment);
            $('#successChange').val(transactionChange);
            $(document).on('submit', '#successForm', function (e) {
                e.preventDefault();
                location.reload();
            });
        }
    });
}

function openPaymentForm() {
    $.ajax({
        type: "get",
        url: "/transaction/paymentForm",
        contentType: "html",
        success: function (paymentForm) {
            $('#myModal').modal('show');
            $('.modal-title').html("Payment");
            $('.modal-body').html(paymentForm);
            $('#transactionReference').val($('#reference-input').val());
            $('#transactionBill').val($('#orderGrandTotal').val());
        }
    });

    $(document).on('submit', '#paymentForm', function (event) {
        event.preventDefault();
        makePayment($('#transactionReference').val());
    });

    $(document).on('keyup', '#transactionPayment', function () {
        countChange();
    });
}

function openOrderModal() {
    $.ajax({
        type: "get",
        url: "/transaction/orderModal",
        contentType: "html",
        success: async function (orderModal) {
            $('#myModal').modal('show');
            $('.modal-title').html("Select New Order");
            $('.modal-body').html(orderModal);
            await loadData();
        }
    });
}

function loadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "http://localhost:9001/api/variant/all",
            contentType: "application/json",
            success: function (response) {
                let responseData = response.data;
                responseData.forEach((variant) => {
                    $('#orderDataTable').append(`
                        <tr>
                            <td>
                                <button class="btn btn-success" onclick="addProduct(event, ${variant.id}, '${variant.name}', ${variant.price})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </button>
                            </td>
                            <td>${variant.product.name}</td>
                            <td>${variant.name}</td>
                            <td>${variant.price}</td>
                            <td>${variant.stock}</td>
                        </tr>
                    `)
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

function addProduct(event, id, name, price) {
    event.preventDefault();

    let productJSON = {
        id: id,
        name: name,
        price: price,
        quantity: 1,
        total: price
    };

    if (!selectedProduct.find(selectedProduct => selectedProduct.id == id)) {
        selectedProduct.push(productJSON);
    } else {
        let selectedProductIndex = selectedProduct.findIndex(selectedProduct => selectedProduct.id == id);
        selectedProduct[selectedProductIndex].quantity++;
        selectedProduct[selectedProductIndex].total += productJSON.price;
    }
    
    showProduct();
}

function showProduct() {
    $('#transactionTable').empty();
    let number = 1;
    grandTotal = 0;
    grandTotalQuantity = 0;

    selectedProduct.forEach(product => {
        $('#transactionTable').append(`
            <tr>
                <th style="text-align: center;">${number++}</th>
                <td style="display: none;"><input class="form-control" type="text" value="${product.id}" readonly></td>
                <td><input class="form-control" type="text" value="${product.name}" readonly></td>
                <td><input class="form-control" type="number" value="${product.price}" min="0" readonly></td>
                <td>
                    <div class="input-group">
                        <button class="btn btn-secondary" type="button" onclick="decreaseQuantity(${product.id})">-</button>
                        <input class="form-control" type="number" value="${product.quantity}" min="1" readonly>
                        <button class="btn btn-secondary" type="button" onclick="increaseQuantity(${product.id})">+</button>
                    </div>
                </td>
                <td><input class="form-control" type="number" placeholder="Total" value="${product.total}" min="0" readonly></td>
                <td>
                    <button class="btn btn-danger" onclick="removeOrder(${product.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </button>
                </td>
            </tr>
        `);
    });

    selectedProduct.forEach(product => {
        grandTotal += product.total;
    });

    selectedProduct.forEach(product => {
        grandTotalQuantity += product.quantity;
    });

    let totalRow = `
        <tr id="totalRow" class="table-group-divider">
            <td colspan="3"><strong>Total</strong></td>
            <td><input type="text" class="form-control" value="${grandTotalQuantity}" readonly></td>
            <td><input id="orderGrandTotal" type="text" class="form-control" value="${grandTotal}" readonly></td>
            <td></td>
        </tr>
    `
    $('#transactionTable').append(totalRow);
}

function increaseQuantity(id) {
    let currentProduct = selectedProduct.find(product => product.id == id);
    currentProduct.quantity += 1;
    currentProduct.total += currentProduct.price;
    grandTotalQuantity += 1;
    grandTotal += currentProduct.price;
    showProduct();
}

function decreaseQuantity(id) {
    let currentProduct = selectedProduct.find(product => product.id == id);
    if (currentProduct.quantity - 1 > 0) {
        currentProduct.quantity -= 1;
        currentProduct.total -= currentProduct.price;
        grandTotalQuantity -= 1;
        grandTotal -= currentProduct.price;
        showProduct();
    }
}

function removeOrder(id) {
    let removedOrder = selectedProduct.find(product => product.id == id);
    grandTotal = grandTotal - removedOrder.total;
    grandTotalQuantity = grandTotalQuantity - removedOrder.quantity;
    selectedProduct = selectedProduct.filter(product => product.id !== id);
    showProduct();
}

function countChange() {
    let bill = $('#transactionBill').val();
    let pay = $('#transactionPayment').val();
    let totalChange = pay - bill;
    $('#transactionChange').val(totalChange);
}