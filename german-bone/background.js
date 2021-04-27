/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var lut = {
//"Digit1": { "plain": {"plain": "[", "shifted": "{"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketLeft"},
//"Digit2": { "plain": {"plain": "]", "shifted": "}"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketRight"},
//"Digit3": { "plain": {"plain": "/", "shifted": "?"}, "alternate": {"plain": "", "shifted":""}, "code": "Slash"},
//"Digit4": { "plain": {"plain": "p", "shifted": "P"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
//"Digit5": { "plain": {"plain": "f", "shifted": "F"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
//"Digit6": { "plain": {"plain": "m", "shifted": "M"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
//"Digit7": { "plain": {"plain": "l", "shifted": "L"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
//"Digit8": { "plain": {"plain": "j", "shifted": "J"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
//"Digit9": { "plain": {"plain": "4", "shifted": "$"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit4"},
//"Digit0": { "plain": {"plain": "3", "shifted": "#"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit3"},
//"Minus": { "plain": {"plain": "2", "shifted": "@"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit2"},
//"Equal": { "plain": {"plain": "1", "shifted": "!"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit1"},

"KeyQ": { "plain": {"plain": "j", "shifted": "J"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
"KeyW": { "plain": {"plain": "d", "shifted": "D"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyD"},
"KeyE": { "plain": {"plain": "u", "shifted": "U"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
"KeyR": { "plain": {"plain": "a", "shifted": "A"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyA"},
"KeyT": { "plain": {"plain": "x", "shifted": "X"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyX"},
"KeyY": { "plain": {"plain": "p", "shifted": "P"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
"KeyU": { "plain": {"plain": "h", "shifted": "H"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "l", "shifted": "L"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"KeyO": { "plain": {"plain": "m", "shifted": "M"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
"KeyP": { "plain": {"plain": "w", "shifted": "W"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyW"},
//"BracketLeft": { "plain": {"plain": "ß", "shifted": "ẞ"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},

"KeyA": { "plain": {"plain": "c", "shifted": "C"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyC"},
"KeyS": { "plain": {"plain": "t", "shifted": "T"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
"KeyD": { "plain": {"plain": "i", "shifted": "I"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyI"},
"KeyF": { "plain": {"plain": "e", "shifted": "E"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyE"},
"KeyG": { "plain": {"plain": "o", "shifted": "O"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyH": { "plain": {"plain": "b", "shifted": "B"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
"KeyJ": { "plain": {"plain": "n", "shifted": "N"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyN"},
"KeyK": { "plain": {"plain": "r", "shifted": "R"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyR"},
"KeyL": { "plain": {"plain": "s", "shifted": "S"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyS"},
"Semicolon": { "plain": {"plain": "g", "shifted": "G"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
"Quote": { "plain": {"plain": "q", "shifted": "Q"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},

"KeyZ": { "plain": {"plain": "f", "shifted": "F"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
"KeyX": { "plain": {"plain": "v", "shifted": "V"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
"KeyC": { "plain": {"plain": "ü", "shifted": "Ü"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketLeft"},
"KeyV": { "plain": {"plain": "ä", "shifted": "Ä"}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
"KeyB": { "plain": {"plain": "ö", "shifted": "Ö"}, "alternate": {"plain": "", "shifted":""}, "code": "Semicolon"},
"KeyN": { "plain": {"plain": "y", "shifted": "Y"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
"KeyM": { "plain": {"plain": "z", "shifted": "Z"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyZ"},
//"Comma": { "plain": {"plain": ",", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Comma"},
//"Period": { "plain": {"plain": ".", "shifted": "'"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit0"},
"Slash": { "plain": {"plain": "k", "shifted": "K"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
};
    

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? 
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent != undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it  
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});