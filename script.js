class AVLNode {
  constructor(order) {
    this.order = order; // Stores the order details, with `prepTime` used for balancing
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  // Utility to get height of a node
  getHeight(node) {
    return node ? node.height : 0;
  }

  // Right rotation
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  // Left rotation
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  // Get balance factor of a node
  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // Insert order by prepTime priority
  insert(node, order) {
    if (!node) return new AVLNode(order);

    if (order.prepTime < node.order.prepTime) {
      node.left = this.insert(node.left, order);
    } else if (order.prepTime > node.order.prepTime) {
      node.right = this.insert(node.right, order);
    } else {
      return node; // Duplicate prepTime orders not allowed
    }

    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balanceFactor = this.getBalanceFactor(node);

    // Left Left Case
    if (balanceFactor > 1 && order.prepTime < node.left.order.prepTime)
      return this.rotateRight(node);

    // Right Right Case
    if (balanceFactor < -1 && order.prepTime > node.right.order.prepTime)
      return this.rotateLeft(node);

    // Left Right Case
    if (balanceFactor > 1 && order.prepTime > node.left.order.prepTime) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balanceFactor < -1 && order.prepTime < node.right.order.prepTime) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Find node with the minimum value (leftmost leaf)
  minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  // Delete node by priority
  deleteNode(node, prepTime) {
    if (!node) return node;

    if (prepTime < node.order.prepTime) {
      node.left = this.deleteNode(node.left, prepTime);
    } else if (prepTime > node.order.prepTime) {
      node.right = this.deleteNode(node.right, prepTime);
    } else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const temp = this.minValueNode(node.right);
        node.order = temp.order;
        node.right = this.deleteNode(node.right, temp.order.prepTime);
      }
    }

    if (!node) return node;
    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;

    const balanceFactor = this.getBalanceFactor(node);

    // Balance the tree
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0)
      return this.rotateRight(node);
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0)
      return this.rotateLeft(node);
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Public method to insert an order
  insertOrder(order) {
    this.root = this.insert(this.root, order);
  }

  // Public method to delete the order with the minimum priority
  dequeueOrder() {
    if (!this.root) return null;
    const minOrderNode = this.minValueNode(this.root);
    this.root = this.deleteNode(this.root, minOrderNode.order.prepTime);
    return minOrderNode.order;
  }

  // Utility function to traverse and print the AVL tree in order (for debugging)
  inOrderTraversal(node = this.root, result = []) {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.order);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }
}

// UI-related methods
const orderTree = new AVLTree();

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

  orderTree.insertOrder(newOrder);
  renderQueue();
  document.getElementById("orderName").value = "";
}

function dequeueOrder() {
  const dequeuedOrder = orderTree.dequeueOrder();
  if (dequeuedOrder)
    alert(
      `Dequeued Order: ${dequeuedOrder.name} (Priority: ${dequeuedOrder.prepTime})`
    );
  else alert("Queue is empty");
  renderQueue();
}

function clearQueue() {
  orderTree.root = null;
  renderQueue();
}

function renderQueue() {
  const queueContainer = document.getElementById("orderTree");
  const orders = orderTree.inOrderTraversal();
  queueContainer.innerHTML = orders
    .map((order) => `<div>${order.name} (Priority: ${order.prepTime})</div>`)
    .join("");
}
