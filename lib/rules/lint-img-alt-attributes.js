const { findAttribute, isImgElement, hasAttribute } = require('ember-template-lint').ASTHelpers;
const Rule = require('ember-template-lint').Rule;

/**
 Disallow usage of `<img>` without an `alt` attribute.

 Good:

 ```
 <img alt="some stuff">
 ```

 Bad:

 ```
 <img>
 ```
*/
module.exports = class ImgAltAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let isImg = isImgElement(node);
        if (!isImg) {
          return;
        }

        let ariaHidden = hasAttribute(node, 'aria-hidden');
        let altPresent = isAltPresent(node);

        if (!ariaHidden && !altPresent) {
          this.log({
            message: 'img tags must have an alt attribute',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

function isAltPresent(node) {
  let altAttribute = findAttribute(node, 'alt');

  return !!altAttribute;
}
