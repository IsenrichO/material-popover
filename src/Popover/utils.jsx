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

export const recursiveDescent = (parent, child) => {
  let node = child.parentNode;

  while (node !== null) {
    if (node === parent) return true;
    node = node.parentNode;
  }

  return false;
};


export default {
  handleTouchTap,
  handleRequestClose,
  recursiveDescent,
  setAnchor,
  setTarget,
};
