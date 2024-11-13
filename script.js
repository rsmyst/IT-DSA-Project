let orderQueue = [];

function addOrder() {
  const orderName = document.getElementById("orderName").value.trim();
  const orderCategory = document.getElementById("orderCategory");
  const preparationTime = parseInt(orderCategory.value, 10);
  const categoryText = orderCategory.options[orderCategory.selectedIndex].text;

  if (orderName === "") {
    alert("Please enter an order name");
    return;
  }

  const newOrder = {
    name: orderName,
    category: categoryText,
    prepTime: preparationTime,
    timestamp: Date.now(),
  };

  orderQueue.push(newOrder);
  updateQueue();
  document.getElementById("orderName").value = "";
}

function dequeueOrder() {
  if (orderQueue.length === 0) {
    alert("No orders in the queue");
    return;
  }

  orderQueue.sort(
    (a, b) => a.prepTime - b.prepTime || a.timestamp - b.timestamp
  );
  orderQueue.shift();
  updateQueue();
}

function clearQueue() {
  orderQueue = [];
  updateQueue();
}

function updateQueue() {
  orderQueue.sort(
    (a, b) => a.prepTime - b.prepTime || a.timestamp - b.timestamp
  );

  const queueContainer = document.getElementById("orderQueue");
  queueContainer.innerHTML = "";

  orderQueue.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-item";
    orderDiv.innerHTML = `
            <span>${order.name} - <em>${order.category}</em></span>
            <span class="order-priority">Prep Time: ${order.prepTime}</span>
        `;
    queueContainer.appendChild(orderDiv);
  });
}
