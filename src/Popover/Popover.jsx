import PopoverPure from './PopoverPure';
import styler from '../styler';

export default styler({
  popoverContainer: {
    position: 'relative',
    display: 'inline-block',
    maxWidth: 300,
    padding: [16, 0, 16, 24],
    backgroundColor: '#FFF',
    overflowY: 'visible',
    boxShadow: [{
      inset: null,
      x: 0,
      y: 3,
      blur: 10,
      spread: null,
      color: 'rgba(0, 0, 0, 0.19)',
    }, {
      inset: null,
      x: 0,
      y: 6,
      blur: 10,
      spread: null,
      color: 'rgba(0, 0, 0, 0.23)',
    }],
  },
  popoverArrow: {
    position: 'absolute',
    left: -20,
    border: {
      width: 10,
      style: 'solid',
      color: 'transparent',
    },
    borderRightColor: '#FFF',
    filter: 'drop-shadow(-3px 0 3px rgba(0, 0, 0, 0.24))',
  },
})(PopoverPure);
