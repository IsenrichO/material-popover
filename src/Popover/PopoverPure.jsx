import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { classes, ClassNamesPropType } from 'aesthetic';
import EventListener from 'react-event-listener';
import throttle from 'lodash.throttle';
import LayerInjector from './LayerInjector';

export default class PopoverPure extends Component {
  static PropTypes = {
    anchorEl: PropTypes.object,
    anchorOrigin: PropTypes.shape({    // propTypes.origin,
      horizontal: PropTypes.string,
      vertical: PropTypes.string,
    }),
    autoCloseWhenOffScreen: PropTypes.bool,
    canAutoPosition: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    classNames: ClassNamesPropType.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.object,
    targetOrigin: PropTypes.shape({    // propTypes.origin,
      horizontal: PropTypes.string,
      vertical: PropTypes.string,
    }),
  };

  static defaultProps = {
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    autoCloseWhenOffScreen: true,
    canAutoPosition: true,
    onRequestClose() {},
    isOpen: false,
    style: {
      display: 'inline-block',
      overflowY: 'auto',
    },
    targetOrigin: {
      horizontal: 'left',
      vertical: 'top',
    },
  };

  constructor(props) {
    super(props);

    this.requestClose = ::this.requestClose;
    this.handleResize = throttle(this.positionPopover, 100);
    this.scrollHandler = throttle(this.positionPopover.bind(this, true), 50);
  }

  componentDidMount() { this.positionPopover(); }
  componentDidUpdate() { this.positionPopover(); }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === this.props.isOpen) return;
    if (nextProps.isOpen) {
      this.anchorEl = nextProps.anchorEl || this.props.anchorEl;
    }
  }

  componentWillUnmount() {
    // this.handleResize.cancel();
    // this.handleScroll.cancel();
  }

  requestClose(reason) {
    if (this.props.onRequestClose) {
      this.props.onRequestClose(reason);
    }
  }

  renderPopoverWrapper(pagePosition = {}) {
    const { classNames, style } = this.props;

    return (
      <div
        style={{
          ...style,
          opacity: open ? 1 : 0,
          transform: open ? 'scaleY(1)' : 'scaleY(0)',
        }}
        className={classNames.popoverContainer}
      >
        <span className={classNames.popoverArrow} />
        {this.props.children}
      </div>
    );
  }

  getAnchorPosition(anchorEl) {
    anchorEl = (anchorEl ? anchorEl : findDOMNode(this));
    const anchorRect = anchorEl.getBoundingClientRect();

    const { top, bottom, left, right } = anchorRect,
          { offsetWidth: width, offsetHeight: height } = anchorEl,
          middle = (left + ((right - left) / 2)),
          center = (top + ((bottom - top) / 2));
    return { top, bottom, left, right, width, height, middle, center };
  }

  getTargetPosition(targetEl) {
    const { offsetHeight, offsetWidth } = targetEl;

    return {
      top: 0,
      center: (offsetHeight / 2),
      bottom: offsetHeight,
      left: 0,
      middle: (offsetWidth / 2),
      right: offsetWidth,
    };
  }

  renderLayer = () => {
    const { anchorEl, isOpen } = this.props;

    const {
      width,
      height,
      left,
      right,
      bottom,
      top,
    } = anchorEl.getBoundingClientRect();

    const pagePosition = {
      left: left + width,
      top,
    };

    if (!isOpen) return null;

    return this.renderPopoverWrapper(pagePosition);
  }

  positionPopover(isScrolling = false) {
    if (!this.props.isOpen || !this.portal.getPortal()) return;

    const WIN_HEIGHT = window.innerHeight,
          targetEl = this.portal.getPortal().children[0],
          arrowEl = targetEl.children[0],
          anchorEl = (this.props.anchorEl || this.anchorEl);

    const anchorPos = this.getAnchorPosition(anchorEl),
          targetPos = this.getTargetPosition(targetEl);

    let targetPosition = {
      top: anchorPos.top - targetPos.top,
      left: anchorPos.right - targetPos.left,
    };

    if (isScrolling && this.props.autoCloseWhenOffScreen) {
      this.autoCloseWhenOffScreen(anchorPos);
    }

    if (anchorPos.top + targetPos.bottom > WIN_HEIGHT) {
      targetPosition.top = (anchorPos.top + anchorPos.height - targetPos.bottom);
    }

    const arrowVerticalOffset = ((anchorPos.height - 20) / 2);

    targetEl.style.top = `${targetPosition.top}px`;
    targetEl.style.left = `${Math.max(0, targetPosition.left)}px`;
    targetEl.style.maxHeight = `${WIN_HEIGHT}px`;

    switch (true) {
      case WIN_HEIGHT - anchorPos.top > targetPos.bottom:
        arrowEl.style.top = `${arrowVerticalOffset}px`;
        arrowEl.style.bottom = 'auto';
        break;
      case WIN_HEIGHT - anchorPos.top < targetPos.bottom:
        arrowEl.style.top = 'auto';
        arrowEl.style.bottom = `${arrowVerticalOffset}px`;
        break;
      default:
        arrowEl.style.display = 'none';
        break;
    }
  }

  autoCloseWhenOffScreen({ top, left }) {
    const {
      innerHeight: WIN_HEIGHT,
      innerWidth: WIN_WIDTH,
    } = window;

    if (top < 0
      || top > WIN_HEIGHT
      || left < 0
      || left > WIN_WIDTH
    ) this.requestClose('offScreen');
  }

  render() {
    const { isOpen } = this.props;

    return (
      <div>
        <EventListener
          target="window"
          onResize={this.handleResize}
          onScroll={this.scrollHandler}
        />
        <LayerInjector
          isOpen={isOpen}
          render={this.renderLayer}
          handleClickAway={this.requestClose}
          ref={(portal) => { this.portal = portal; }}
        />
      </div>
    );
  }
}
