class ListNodeV1 {
    key: number;
    val: number;
    expiryTime: number;
    next: ListNodeV1 | null;
    prev: ListNodeV1 | null;
    constructor(val: number, key:number, expiryTimeInMiliseconds: number, next?: ListNodeV1 | null, prev?: ListNodeV1 | null) {
        this.val =  val;
        this.key = key;
        this.expiryTime = new Date().getTime() + expiryTimeInMiliseconds;
        this.next = (next===undefined ? null : next);
        this.prev = (prev===undefined ? null : prev);
    }
}

class DoublyLinkedList {
    head: ListNodeV1 | null;
    tail: ListNodeV1 | null;
    currentLength: number;

    constructor(head: ListNodeV1 | null, tail: ListNodeV1 | null){
        this.head = head===undefined ? null : head;
        this.tail = tail===undefined ? null : tail;
        this.currentLength = 0;
    }

    public insertAtHead(node: ListNodeV1, increaseLength: boolean = true){
        node.prev = null;
        node.next = this.head;
        if (this.head === null && this.tail === null){
            this.head = node
            this.tail = node;
        } else {
            this.head.prev = node;
            this.head = node;
        }
        if (increaseLength){
            this.currentLength++;
        }
        return node;
    }

    public removeNodeFromHead(){
        if (this.head === null){
            this.currentLength = 0;
            return;
        }
        const oldTailKey = this.head.key;
        const nextNode = this.head.next;
        if (nextNode === null){ // head == tail
            this.head = null;
            this.tail = null;
        } else {
            nextNode.prev = null;
            this.head = nextNode;
        }
        this.currentLength--;
        return oldTailKey;
    }

    public removeLastNodeFromTail(){
        if (this.tail === null){
            this.currentLength = 0;
            return;
        }
        const oldTailKey = this.tail.key;
        const prevNode = this.tail.prev;
        if (prevNode === null){ // head == tail
            this.head = null;
            this.tail = null;
        } else {
            prevNode.next = null;
            this.tail = prevNode;
        }
        this.currentLength--;
        return oldTailKey;
    }

    public moveNodeFromMiddleToHead(node: ListNodeV1){
        const prevNode = node.prev;
        const nextNode = node.next;

        if (prevNode === null && nextNode === null){
            this.head = node;
            this.tail = node;
            return;
        } else if (prevNode === null){ // head node
            node.next = this.head.next;
            this.head = node;
            return;
        } else if (nextNode === null){ // tail node
            this.removeLastNodeFromTail();
            this.insertAtHead(node);
        } else {
            prevNode.next = nextNode;
            nextNode.prev = prevNode;
            this.insertAtHead(node, false);
        }
    }

    public removeNode(node: ListNodeV1){
        const prevNode = node.prev;
        const nextNode = node.next;

        if (prevNode === null && nextNode === null){
            this.head = null;
            this.tail = null;
            this.currentLength = 0;
        } else if (prevNode === null){ // head node
            this.removeNodeFromHead();
        } else if (nextNode === null){ // tail node
            this.removeLastNodeFromTail();
        } else {
            prevNode.next = nextNode;
            nextNode.prev = prevNode;
            this.currentLength--;
        }
    }

    public returnList(){
        const list = []
        let ptr = this.head;
        while (ptr!==null){
            list.push(ptr.key);
            ptr = ptr.next;
        }
        return list;
    }
}

class LRUCache {
    // queue for maintaining recent number map
    // map for key to value
    // map for occurence to key
    lRUCacheKeyList: DoublyLinkedList;
    lRUCacheKeyNodeMap: Map<number, ListNodeV1 | null>;
    capacity: number;
    expiryTimeInMiliseconds: number;
    constructor(capacity: number, expiryTimeInMiliseconds: number) {
        this.capacity = capacity;
        this.lRUCacheKeyList = new DoublyLinkedList(null, null);
        this.lRUCacheKeyNodeMap = new Map<number, ListNodeV1 | null>()
        this.expiryTimeInMiliseconds = expiryTimeInMiliseconds;
    }

    get(key: number): number {
        const result = this.lRUCacheKeyNodeMap.get(key);
        if (result){
            if (result.expiryTime <= new Date().getTime()){
                this.lRUCacheKeyList.removeNode(result);
                this.lRUCacheKeyNodeMap.delete(key);
                return -1;
            }
            this.lRUCacheKeyList.moveNodeFromMiddleToHead(result);
        }
        return result === undefined || result === null ? -1 : result.val;
    }

    put(key: number, value: number): void {
        const result = this.lRUCacheKeyNodeMap.get(key);
        if (result){
            this.lRUCacheKeyList.moveNodeFromMiddleToHead(result);
            result.val = value;
        } else {
            const newNode = new ListNodeV1(value, key, this.expiryTimeInMiliseconds);
            if (this.capacity === this.lRUCacheKeyList.currentLength){
                const keyOfremovalNode = this.lRUCacheKeyList.removeLastNodeFromTail();
                if (keyOfremovalNode !== undefined){
                    this.lRUCacheKeyNodeMap.delete(keyOfremovalNode);
                }
            }
            const newNodeset = this.lRUCacheKeyList.insertAtHead(newNode);
            this.lRUCacheKeyNodeMap.set(key, newNodeset);
        }
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */