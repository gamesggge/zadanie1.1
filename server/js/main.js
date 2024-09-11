const url = "https://gamesggge.ru:1444/api/v1/"

async function createProductForm() {
    event.preventDefault(); // Останавливает стандартное поведение формы
    const form = document.getElementById('createProductForm');
    const data = {
        plu: form.plu.value,
        name: form.name.value
    };

    try {
        const response = await fetch(`${url}product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert('Продукт создан: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при создании продукта:', error);
    }
}

async function updateProductForm() {
    event.preventDefault();
    const form = document.getElementById('updateProductForm');
    const data = {
        product_id: form.product_id.value,
        plu: form.plu.value,
        name: form.name.value
    };

    try {
        const response = await fetch(`${url}product?id=${data.product_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert('Продукт обновлён: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при обновлении продукта:', error);
    }
}

async function deleteProductForm() {
    event.preventDefault();
    const form = document.getElementById('deleteProductForm');
    const product_id = form.product_id.value;

    try {
        const response = await fetch(`${url}product?plu=${product_id}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        alert('Продукт удалён: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
    }
}

async function searchProductsForm() {
    event.preventDefault();
    const form = document.getElementById('searchProductsForm');
    const search_plu = form.search_plu.value;
    const search_name = form.search_name.value

    try {
        const response = await fetch(`${url}product?plu=${search_plu}&name=${search_name}`);
        const result = await response.json();
        document.getElementById('productsResults').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Ошибка при поиске продукта:', error);
    }
}

async function searchProductsFormAll() {
    event.preventDefault();
    try {
        const response = await fetch(`${url}product`);
        const result = await response.json();
        document.getElementById('productsResultsAll').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Ошибка при поиске всех продуктов:', error);
    }
}

async function createStockForm() {
    event.preventDefault();
    const form = document.getElementById('createStockForm');
    const data = {
        product_id: form.product_id.value,
        shop_id: form.shop_id.value,
        on_shelf: form.on_shelf.value,
        in_order: form.in_order.value
    };

    try {
        const response = await fetch(`${url}stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert('Остаток создан: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при создании остатка:', error);
    }
}

async function updateStockForm() {
    event.preventDefault();
    const form = document.getElementById('updateStockForm');
    const data = {
        product_id: form.product_id.value,
        shop_id: form.shop_id.value,
        on_shelf: form.on_shelf.value,
        in_order: form.in_order.value
    };

    try {
        const response = await fetch(`${url}stock?id=${data.product_id}&shop_id=${data.shop_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert('Остаток обновлён: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при обновлении остатка:', error);
    }
}

async function deleteStockForm() {
    event.preventDefault();
    const form = document.getElementById('deleteStockForm');
    const product_id = form.product_id.value;

    try {
        const response = await fetch(`${url}stock?id=${product_id}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        alert('Остаток удалён: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Ошибка при удалении остатка:', error);
    }
}

async function searchStocksForm() {
    event.preventDefault();
    const form = document.getElementById('searchStocksForm');
    const params = new URLSearchParams({
        search_plu_stock: form.search_plu_stock.value,
        search_shop_id: form.search_shop_id.value,
        on_shelf_from: form.on_shelf_from.value,
        on_shelf_to: form.on_shelf_to.value,
        in_order_from: form.in_order_from.value,
        in_order_to: form.in_order_to.value
    });

    try {
        const response = await fetch(`${url}stock?${params.toString()}`);
        const result = await response.json();
        document.getElementById('stocksResults').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Ошибка при поиске остатков:', error);
    }
}
