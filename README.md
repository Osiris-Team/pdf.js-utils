# pdf.js-utils
pdf.js-utils

### Usage
Copy src.js into your project or prepend it to your JavaScript code
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
