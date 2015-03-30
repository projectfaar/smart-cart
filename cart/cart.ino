#include <SoftwareSerial.h> // Bring in the software serial library 
#include <Bridge.h>
#include <HttpClient.h>
const int tagLength = 10;    // each tag ID contains 10 bytes 
const int startByte = 0x0A;  // Indicates start of a tag
const int endByte   = 0x0D;  // Indicates end of a tag

char tagID[tagLength + 1];   // array to hold the tag you read 

const int rxpin = 6; // Pin for receiving data from the RFID reader
const int txpin = 7; // Transmit pin; not used
SoftwareSerial rfidPort(rxpin, txpin); // create a Software Serial port 

String matchingTag = "02007F1222";
String matchingTag2 = "120092FD0B";
const int ledPin = 12;
//const int ledPin2 = 12;
const int wait = 250; // Amount of time LED stays on, in milliseconds

//String lastTag = "";
String tag = tagID;

bool chipsScanned = false;
bool colaScanned = false;

void setup() {
  // begin serial communication with the computer
  Serial.begin(9600);

  // begin serial communication with the RFID module
  rfidPort.begin(2400);
  
  pinMode(ledPin, OUTPUT);   // Green LED
  //pinMode(ledPin2, OUTPUT);  // Yellow LED

}

void loop() {
  // read in and parse serial data:
  if (rfidPort.available() > 0 && readTag()) { 
    tag = String(tagID);
    if (matchingTag == tag && !colaScanned)
    { 
      // Serial.println("-- Added COLA to shopping cart");
      Serial.println("COLA");
      digitalWrite(ledPin, HIGH); // Turn on the yellow LED
      delay(wait);                // Wait time before turning light off
      digitalWrite(ledPin, LOW);  // Turn the LED off by making the voltage LOW
      colaScanned = true;
    } else if (matchingTag2 == tag && !chipsScanned) {
      // Serial.println("-- Added CHIPS to shopping cart");
      Serial.println("CHIPS");
      digitalWrite(ledPin, HIGH); // Turn on the yellow LED
      delay(wait);                 // Wait time before turning light off
      digitalWrite(ledPin, LOW);  // Turn the LED off by making the voltage LOW
      chipsScanned = true;
    } else {
      digitalWrite(ledPin, LOW);
    }
   // Serial.println(tagID);
  }
}

/*
This method reads the tag, and puts its
ID in the tagID
*/
boolean readTag() {
  
  char thisChar = rfidPort.read(); 
  
  if (thisChar == startByte) {   
    if (rfidPort.readBytesUntil(endByte, tagID, tagLength)) {      
      return true;
    }
  }
  return false;
}
