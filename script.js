class Order {
  constructor(id, name, category, prepTime, timestamp) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.prepTime = prepTime;
    this.timestamp = timestamp;
    this.originalPrepTime = prepTime;
  }

  compareTo(other) {
    if (this.prepTime !== other.prepTime) {
      return this.prepTime - other.prepTime;
    }
    return this.timestamp - other.timestamp;
  }
}

class AVLNode {
  constructor(order) {
    this.order = order;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    return y;
  }

  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  insert(node, order) {
    if (!node) return new AVLNode(order);

    if (order.compareTo(node.order) < 0) {
      node.left = this.insert(node.left, order);
    } else {
      node.right = this.insert(node.right, order);
    }

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    return this.balance(node);
  }

  balance(node) {
    const balanceFactor = this.getBalance(node);

    if (balanceFactor > 1 && node.left && node.left.order.compareTo(node.order) > 0) {
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && node.right && node.right.order.compareTo(node.order) < 0) {
      return this.rotateLeft(node);
    }

    if (balanceFactor > 1 && node.left && node.left.order.compareTo(node.order) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && node.right && node.right.order.compareTo(node.order) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  findMinNode(node) {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  delete(node, order) {
    if (!node) return node;

    if (order.compareTo(node.order) < 0) {
      node.left = this.delete(node.left, order);
    } else if (order.compareTo(node.order) > 0) {
      node.right = this.delete(node.right, order);
    } else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const minLargerNode = this.findMinNode(node.right);
        node.order = minLargerNode.order;
        node.right = this.delete(node.right, minLargerNode.order);
      }
    }

    if (!node) return node;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    return this.balance(node);
  }

  inorderTraversal(node, orders = []) {
    if (node) {
      this.inorderTraversal(node.left, orders);
      orders.push(node.order);
      this.inorderTraversal(node.right, orders);
    }
    return orders;
  }
}

const orderQueue = new AVLTree();

function generateUniqueID() {
  return Math.floor(100 + Math.random() * 900);
}

function addOrder() {
  const orderName = document.getElementById("orderName").value.trim();
  const orderCategory = document.getElementById("orderCategory");
  const preparationTime = parseInt(orderCategory.value, 10);
  const categoryText = orderCategory.options[orderCategory.selectedIndex].text;

  if (orderName === "") {
    alert("Please enter an order name");
    return;
  }

  const newOrder = new Order(
    generateUniqueID(),
    orderName,
    categoryText,
    preparationTime,
    Date.now()
  );

  orderQueue.root = orderQueue.insert(orderQueue.root, newOrder);
  updateQueue();
  document.getElementById("orderName").value = "";
}

function dequeueOrder() {
  if (!orderQueue.root) {
    alert("No orders in the queue");
    return;
  }

  const minOrderNode = orderQueue.findMinNode(orderQueue.root);
  orderQueue.root = orderQueue.delete(orderQueue.root, minOrderNode.order);
  updateQueue();
}

function clearQueue() {
  orderQueue.root = null;
  updateQueue();
}

function ageOrders() {
  function ageNode(node) {
    if (!node) return;

    if (node.order.prepTime > 1) {
      node.order.prepTime -= 1;
    }
    ageNode(node.left);
    ageNode(node.right);
  }

  ageNode(orderQueue.root);
  updateQueue();
}

setInterval(ageOrders, 15000);

function updateQueue() {
  const orders = orderQueue.inorderTraversal(orderQueue.root);
  const queueContainer = document.getElementById("orderQueue");
  queueContainer.innerHTML = "";

  orders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-item";
    orderDiv.innerHTML = `
            <span>ID: ${order.id} - ${order.name} - <em>${order.category}</em></span>
            <span class="order-priority">Prep Time: ${order.prepTime}</span>
        `;
    queueContainer.appendChild(orderDiv);
  });
}
