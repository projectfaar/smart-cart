/*
The MIT License (MIT)

Copyright (c) 2015 projectfaar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var net = require('net');

var config = {
  port: 7070
}

var STATES = {
  UNAUTH: 0,
  CART: 1,
  PHONE: 2
};

var carts = {};

net.createServer(function(conn) {
  var state = STATES.UNAUTH;
  var phone = null;

  conn.on('data', function(d) {
    // speaks a simple comma-based, state-machine style protocol
    d = d.toString().trim().split(",");

    if(state == STATES.UNAUTH) {
      var identifier = d[0];
      var isCart = d[1];

      if(identifier && identifier.length && isCart && isCart.length) {
          if(isCart == '0') {
            console.log("Phone "+identifier);

            if(carts[identifier]) {
                carts[identifier](conn); // associate this connection with the cart
                                        // such lambda magic
                state = STATES.PHONE; // setup state machine appropiately
            } else {
              conn.end('-1,No corresponding cart\n');
            }
          } else if(isCart == '1') {
            console.log("Cart "+identifier);

            carts[identifier] = function(phoneConnection) { // using lambda magic, create a handler
              phone = phoneConnection;
            };

            state = STATES.CART; // state machine
          } else {
            console.log("Invalid device type");
            conn.end();
          }
      } else {
        conn.end();
      }
    } else if(state == STATES.CART) {
      var item = d[0];

      if(phone) {
        try {
          phone.write([0, item].join(",") + "\n"); // alert phone of current item
        } catch(e) {
          console.log(e);
        }
      }
    } else if(state == STATES.PHONE) {
      // nobody wants to listen to poor phone
    }
  })
}).listen(config.port);
