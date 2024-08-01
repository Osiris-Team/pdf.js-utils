# pdf.js-utils
A collection of utility functions for pdf.js to make the lives of developers easier.

### Usage
Copy [src.js](./src.js) into your project or prepend it to your JavaScript code
to be able to use the additional functions provided.

### Adding/Removing Text Fields
Direct Usage: `addTextEditor(1, "hello world!")`
Safe Usage:
```js
waitForAnnotationEditorLayer()
    .then(() => {
        console.log('All annotation editor layers are ready!');
        // Your code here that depends on the pageEditorLayer, for example:
        addTextEditor(1, "hello world!")
    })
    .catch(error => {
        console.error(error);
    });
```
