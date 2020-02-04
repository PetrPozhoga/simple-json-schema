react-simple-jsonschema-form
============================

## Introductions

react-simple-jsonschema-form a simple react component that builds a HTML form from a json object.

## Install
```
npm install --save react-simple-jsonschema-form
```

## Usage

```js
import React from 'react'
import jsonSchema from './schema.json' // Your custom json schema

import 'json-paradise-schema/build/styles.css'
import JsonParadiseSchema from 'react-simple-json-schema'

function App() {
  
  const send = (params, properties) => {
    // params - received values ​​entered by the user after onSubmit
    console.log(params)
    console.log(properties)
  }

  return (
    <div className="App">
      <JsonParadiseSchema schema={ schema } onSubmit={ send }/>
    </div>
  );
}

export default App;
```

## Example Json schema

```json5
{
  "title": "A registration form",
  "description": "A simple form example.",
  "required": [
    "firstName",
    "lastName",
    "password",
    "termsOfUse"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "value": "Chuck",
      "autoFocus": true
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age",
      "description": "(earthian year)"
    },
    "bio": {
      "type": "string",
      "title": "Bio",
      "isTextarea": true
    },
    "password": {
      "type": "password",
      "title": "Password",
      "minLength": "3",
      "hint": "Hint: Make it strong!"
    },
    "termsOfUse": {
      "type": "checkbox",
      "value": true,
      "title": "You agree terms of use"
    }
  },
  "submitValue": "Send"
}
```
## API

### schema - ``` object ``` Required parameter

#### schema.title - ``` string ```

h1 heading (optional parameter).

#### schema.description - ``` string ```

h2 heading (optional parameter).

#### schema.required - ``` array ``` (of strings)

An array containing the names (Object key(s)) of the fields to be filled, otherwise the form will not pass validation.
This is an optional parameter, ```inside only the string```

#### schema.properties - ``` object ``` (of object(s)) Required parameter

An object that contains objects (key names are custom) that describe field customization.

#### schema.properties.yourCustomName(firstName).type - ``` string ```

Input type may equal - ``` string | integer(number) | mail | password | checkbox ```.

#### schema.properties.yourCustomName(firstName).title - ``` string ```

Title for your field.

#### schema.properties.yourCustomName(firstName).value - ``` string | boolean```

The contents of your field, type ``` string ```, can be Boolean, if ```properties.yourCustomName(termsOfUse).type = checkbox```.

#### schema.properties.yourCustomName(firstName).autoFocus - ``` boolean ```

Focuses on the field when loading the schema.

#### schema.properties.yourCustomName(age).description - ``` string ```

Descriptions of your field under the heading.

#### schema.properties.yourCustomName(bio).isTextarea - ``` boolean ```

Creates a large textarea ``` instead of Input ``` field for more information.

#### schema.properties.yourCustomName(password).minLength - ``` string ```

The minimum number of characters to pass validation.

#### schema.properties.yourCustomName(password).hint - ``` string ```

The tooltip that will be under your field.

#### schema.submitValue - ``` string ``` Required parameter

The name of your button.

### onSubmit - ``` func ``` Required parameter

Callback after the user clicks the button and the form passes validation.
