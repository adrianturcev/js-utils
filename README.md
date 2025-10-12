# Yet-Another-JS-Utils

## Installation

```
npm install yet-another-js-utils
```

## Usage

```js
const yaju = require('yet-another-js-utils');
let dom = yaju.qs('#contents'),
    previousRender = document.createElement('div'),
    newRender = document.createElement('div'),
    style = 'italic';
newRender.innerHTML = yaju.html`<span style="${italic}">Hello, world!</span>`;
yaju.diffVDomAndUpdate(previousRender, newRender, dom);
this.previousRender = newRender;
yaju.resetDataState(dom);
yaju.addDataState(dom, 'updated');
// Plus a few utility functions...
```

## Dependencies

None.

## License

Copyright (c) Adrian Turcev. All rights reserved.

Licensed under the MPL-2.0 license.
