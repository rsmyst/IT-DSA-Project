class Order {
  constructor(name, category, prepTime, timestamp) {
    this.name = name;
    this.category = category;
    this.prepTime = prepTime;
    this.timestamp = timestamp;
  }

  // Comparator based on preparation time and timestamp
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

  // Helper to get the height of a node
  height(node) {
    return node ? node.height : 0;
  }

  // Right rotation for balancing
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    return x;
  }

  // Left rotation for balancing
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    return y;
  }

  // Get the balance factor of a node
  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  // Insert an order into the AVL Tree
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

  // Balance the AVL Tree after insertion or deletion
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

  // Find the node with the smallest value (highest priority order)
  findMinNode(node) {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  // Remove an order from the AVL Tree
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

  // Inorder traversal to display orders
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

function addOrder() {
  const orderName = document.getElementById("orderName").value.trim();
  const orderCategory = document.getElementById("orderCategory");
  const preparationTime = parseInt(orderCategory.value, 10);
  const categoryText = orderCategory.options[orderCategory.selectedIndex].text;

  if (orderName === "") {
    alert("Please enter an order name");
    return;
  }

  const newOrder = new Order(orderName, categoryText, preparationTime, Date.now());
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

function updateQueue() {
  const orders = orderQueue.inorderTraversal(orderQueue.root);
  const queueContainer = document.getElementById("orderQueue");
  queueContainer.innerHTML = "";

  orders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-item";
    orderDiv.innerHTML = `
            <span>${order.name} - <em>${order.category}</em></span>
            <span class="order-priority">Prep Time: ${order.prepTime}</span>
        `;
    queueContainer.appendChild(orderDiv);
  });
}
