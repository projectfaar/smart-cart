# smart-cart
Smart cart Arduino sketches and node.js server

# High-level protocol
The Smart Cart protocol is comma-based and uses a simple state machine methodology for matching carts with phones and establishing a stream between these two entities.

## Cart Protocol
The cart begins the process through authentication in the form of `[IDENTIFIER],1`.

[IDENTIFIER] can be replaced with any _unique_ string to identify the cart by the phone.

Once authenticated, the cart will push item identifiers to the server (no commas allowed in the ID) which the server will sync to the designated phone.

## Phone protocol
The phone begins the process through authentication in the form `[IDENTIFIER],0`.

[IDENTIFIER] will be replaced with the _unique_ identifier string that the cart has authenticated with.

Once authenticated, the server will push incoming items from the cart in the form of `0,[ITEMIDENTIFIER]` where [ITEMIDENTIFIER] is replaced with the corresponding unqiue ID of the item.