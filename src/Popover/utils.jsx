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

export const handleRequestClose = (ctx) => {
  ctx.setState({ open: false });
};

export const setTarget = (el, position, ctx) => {
  const { targetOrigin } = ctx.state;
  targetOrigin[el] = position;
  ctx.setState({ targetOrigin });
};

export const setAnchor = (el, position, ctx) => {
  const { anchorOrigin } = ctx.state;
  anchorOrigin[el] = position;
  ctx.setState({ anchorOrigin });
};

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

export const isDescendantNodeOf = (parent, child) => {
  let node = child.parentNode;
  while (node !== null) {
    if (node === parent) return true;
    node = node.parentNode;
  }
  return false;
};

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
