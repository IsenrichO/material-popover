/**
 * Herein is contained a collection of general-purpose items that serve to expedite
 * the user's implementation of the `<Popover />` component. Among the things found
 * are true constants, methods composed in the spirit of classical Functional
 * Programming  principles and a grabbag of other miscellania.
 */

export const handleTouchTap = (evt, ctx) => {
  evt.preventDefault(); // Prevents "ghost click" effect
  ctx.setState({
    open: true,
    anchorEl: evt.currentTarget,
  });
};

/**
 * Pre-built utility function for effecting closure of an open Popover
 * @param  {node} ctx   Sets the context (read: Component) on which `setState` is called
 * @return {undefined}  Implicit `undefined` return value
 */
export const handleRequestClose = (ctx) => {
  ctx.setState({ open: false });
};

/**
 * Sets the target element (`targetEl`) of the Popover
 * @param  {string} el       Defines the dimension (e.g., left, top, right, bottom)
 * @param  {object} position Holds `horizontal` and `vertical` position value strings
 * @param  {node} ctx        Sets the context for calling `setState`
 * @return {undefined}       Implicit `undefined` return value
 */
export const setTarget = (el, position, ctx) => {
  const { targetOrigin } = ctx.state;
  targetOrigin[el] = position;
  ctx.setState({ targetOrigin });
};

/**
 * Sets the anchor element (`anchorEl`) of the Popover
 * @param  {string} el       Defines the dimension (e.g., left, top, right, bottom)
 * @param  {object} position Holds `horizontal` and `vertical` position value strings
 * @param  {node} ctx        Sets the context for calling `setState`
 * @return {undefined}       Implicit `undefined` return value
 */
export const setAnchor = (el, position, ctx) => {
  const { anchorOrigin } = ctx.state;
  anchorOrigin[el] = position;
  ctx.setState({ anchorOrigin });
};

/**
 * A convenience function that allows the user register multiple events at once without
 *  needing to include bloated third-party libraries like jQuery
 * @param  {node}      registrant The element upon which events are to be registered
 * @param  {array}     evts       An array of string names defining the events being added
 * @param  {function}  cbFunc     A callback function to execute as the handler to the declared events
 * @param  {Boolean}   useCapture Set to `true` to enable the capturing phase of the JS event lifecycle
 * @param  {array}     args       Curried arguments passed to the callback function
 * @return {undefined}            Implicit `undefined` return value
 */
export const multiEventRegistrar = function(registrant, evts, cbFunc, useCapture = false, ...args) {
  if (!(events instanceof Array)) {
    throw new TypeError(`Function 'multiEventRegistrar': Array of event name strings required!`);
  }

  const handlerFunc = function(evt) {
    cbFunc.apply(this, args && args instanceof Array ? args : []);
  }

  for (let i = 0; i < evts.length; i += 1) {
    registrant.addEventListener(evts[i], handlerFunc, useCapture);
  }
};

/**
 * Utility function that detects whether a child element is a descendant of the stated parent node
 * @param  {node} parent  The "parent" node against whom `child` is checked
 * @param  {node} child   The node for which the function detects if it is a descendant node
 * @return {Boolean}      Binary value asserting whether `child` is descendant node of `parent`       
 */
export const isDescendantNodeOf = (parent, child) => {
  let node = child.parentNode;
  while (node !== null) {
    if (node === parent) return true;
    node = node.parentNode;
  }
  return false;
};

/**
 * Recursive-implememntation of the above function
 * @param  {node} parent  The "parent" node against whom `child` is checked
 * @param  {node} child   The node for which the function detects if it is a descendant node
 * @return {Boolean}      Binary value asserting whether `child` is descendant node of `parent`   
 */
export const recursiveDescent = (parent, child) => {
  const node = child.parentNode;
  return !!node && node !== parent
    ? recursiveDescent(parent, node) : node === parent
    ? true : false;
};


export default {
  handleTouchTap,
  handleRequestClose,
  isDescendantNodeOf,
  recursiveDescent,
  setAnchor,
  setTarget,
};
