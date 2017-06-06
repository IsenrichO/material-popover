import PopoverPure from './PopoverPure';
import styler from '../styler';

export default styler({
  popoverContainer: {
    position: 'relative',
    display: 'inline-block',
    maxWidth: 350,
    maxHeight: '70vh',
    marginLeft: 12,
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
    transition: [{
      property: 'opacity',
      duration: '450ms',
      timingFunction: 'ease-out',
      delay: null,
    }, {
      property: 'transform',
      duration: '450ms',
      timingFunction: 'ease-out',
      delay: null,
    }],
    transformOrigin: 'top left',
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
    filter: 'drop-shadow(-4px 0 1px rgba(0, 0, 0, 0.11))',
  },
})(PopoverPure);
