import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { classes, ClassNamesPropType } from 'aesthetic';
import EventListener from 'react-event-listener';
import throttle from 'lodash.throttle';
import LayerInjector from './LayerInjector';

export default class PopoverPure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldDropUp: false,
    };

    this.requestClose = ::this.requestClose;
    this.scrollHandler = throttle(this.positionPopover.bind(this, true), 50);
  }

  // componentWillMount() {
  //   window.addEventListener('scroll', this.scrollHandler);
  // }

  componentDidMount() { this.positionPopover(); }
  componentDidUpdate() { this.positionPopover(); }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen === this.props.isOpen) return;
    if (nextProps.isOpen) {
      this.anchorEl = nextProps.anchorEl || this.props.anchorEl;
    }
  }

  requestClose(reason) {
    if (this.props.onRequestClose) {
      this.props.onRequestClose(reason);
    }
  }

  renderPopoverWrapper(pagePosition = {}) {
    const { classNames } = this.props;

    return (
      <div
        className={classNames.popoverContainer}
        ref={(popover) => { this.popover = popover; }}
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
    const {
      anchorEl,
    } = this.props;

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
      console.log('\nANCHOR POSITION:', anchorPos);
      console.log('\nTARGET POSITION:', targetPos);

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

    targetEl.style.top = `${targetPosition.top}px`; // `${Math.max(0, targetPosition.top)}px`;
    targetEl.style.left = `${Math.max(0, targetPosition.left)}px`;
    targetEl.style.maxHeight = `${WIN_HEIGHT}px`;

    switch (true) {
      case WIN_HEIGHT - anchorPos.top > targetPos.bottom:
        arrowEl.style.top = `${(anchorPos.height / 2) - 7}px`;
        arrowEl.style.bottom = 'auto';
        break;
      case WIN_HEIGHT - anchorPos.top < targetPos.bottom:
        arrowEl.style.top = 'auto';
        arrowEl.style.bottom = `${(anchorPos.height / 2) - 7}px`;
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