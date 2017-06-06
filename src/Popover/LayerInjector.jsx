import React, { Component } from 'react';
import ReactDOM, { unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from 'react-dom';
import PropTypes from 'prop-types';
import { ClassNamesPropType } from 'aesthetic';
import EventListener from 'react-event-listener';
import throttle from 'lodash.throttle';
import { recursiveDescent } from './utils';
import styler from '../styler';

export default class LayerInjector extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  getPortal() {
    return this.layer;
  }

  onClickAway = (evt) => {
    console.log('clicked away');

    console.log('is CHild node?', recursiveDescent(this.layer, evt.target));

    if (!recursiveDescent(this.layer, evt.target)) {
      this.props.handleClickAway();
    }
  };

  unrenderLayer() {
    if (!this.layer) return;

    this.layer.removeEventListener('touchstart', this.onClickAway);
    this.layer.removeEventListener('click', this.onClickAway);

    unmountComponentAtNode(this.layer);
    document.body.removeChild(this.layer);
  }

  renderLayer() {
    const {
      isOpen,
      render,
    } = this.props;

    if (isOpen) {
      if (!this.layer) {
        this.layer = document.createElement('DIV');
        document.body.appendChild(this.layer);

        this.layer.addEventListener('touchstart', this.onClickAway);
        this.layer.addEventListener('click', this.onClickAway);
        this.layer.style.position = 'fixed';
        this.layer.style.top = 0;
        this.layer.style.bottom = 0;
        this.layer.style.left = 0;
        this.layer.style.right = 0;
        this.layer.style.zIndex = 2000;
      }

      /**
       * By calling this method in componentDidMount() and
       * componentDidUpdate(), you're effectively creating a "wormhole" that
       * funnels React's hierarchical updates through to a DOM node on an
       * entirely different part of the page.
       */
      const layerElement = render();
      this.layerElement = unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);
    } else {
      this.unrenderLayer();
    }
  }

  render() {
    return null;
  }
}
