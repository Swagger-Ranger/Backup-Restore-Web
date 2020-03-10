function Node(element) {
    this.element = element;
    this.next = null;
    this.previous = null;
}
function DbList(element) {
    this._head = new Node(element);
}
DbList.prototype.getHead = function() {
    return this._head;
};
DbList.prototype.findLast = function() {
    var currNode = this.getHead();
    while (! (currNode.next == null)) {
        currNode = currNode.next;
    }
    return currNode;
};
DbList.prototype.remove = function(node) {
    var currNode = this.find(node);
    if (! (currNode.next == null)) {
        currNode.previous.next = currNode.next;
        currNode.next.previous = currNode.previous;
        currNode.next = null;
        currNode.previous = null;
    }
};
DbList.prototype.find = function(node) {
    var currNode = this.getHead();
    while (currNode.element != node.element) {
        currNode = currNode.next;
    }
    return currNode;
};
DbList.prototype.insert = function(newElement, node) {
    var newNode = new Node(newElement);
    var current = this.find(ndoe);
    newNode.next = current.next;
    newNode.previous = current;
    current.next = newNode;
};
DbList.prototype.insertLast = function(newElement) {
    var newNode = new Node(newElement),
    current = this.findLast();
    current.next = newNode;
    newNode.previous = current;
};
DbList.prototype.removeAfter = function(Node) {
    var currNode = this.find(Node);
    while (currNode.next != null) {
        this.removeLast();
    }
};
DbList.prototype.removeLast = function() {
    var lastNode = this.findLast();
    lastNode.previous.next = null;
    lastNode.previous = null;
};
DbList.prototype.print = function() {
    var currNode = this.getHead();
    while (currNode.next != null) {
        console.log(Tools.json2str(currNode.element) + " -> ");
        currNode = currNode.next;
    }
    console.log(Tools.json2str(currNode.element) + " -> ");
};