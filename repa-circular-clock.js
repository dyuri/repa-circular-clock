/**
 * @license
 * Copyright 2022 Gyuri Horák <dyuri@horak.hu>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';

/**
 * Circular clock element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class RepaCircularClock extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 800px;
        height: 800px;
        font-size: 2rem;
        position: relative;
        display: block;
        overflow: hidden;
        margin: 20px auto;
        background: transparent;
        font-family: monospace;
        color: #444;
      }

      .dial {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--dial-size, 100%);
        height: var(--dial-size, 100%);
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }

      .dial:before {
        content: "";
        inset: 0;
        margin: auto;
        position: absolute;
        display: block;
        width: calc(100% - .45em);
        height: calc(100% - .45em);
        border: 1.5em solid #444;
        border-radius: 50%;
        box-sizing: border-box;
      }

      .ring {
        position: relative;
        width: 100%;
        height: 100%;
        transition: all .5s;
        border: 1.9em solid #333;
        border-radius: 50%;
        border-bottom-color: transparent;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .ring li {
        position: absolute;
        top: -1.5em;
        left: -1.5em;
        height: calc(100% + 3em);
        width: calc(100% + 3em);
        text-align: center;
      }

      .dial-day {
        --dial-size: 90%;
      }

      .dial-month {
        --dial-size: calc(90% - 4em);
      }

      .dial-dow {
        --dial-size: calc(90% - 8em);
      }
    `;
  }

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._rotateFields();
  }

  _rotateFields() {
    const rings = this.shadowRoot.querySelectorAll('.ring');
    rings.forEach(ring => {
      const fields = ring.querySelectorAll('li');
      const length = fields.length;
      if (length > 0) {
        const slice = 270 / length;
        fields.forEach((field, index) => {
          field.style.transform = `rotate(${-135 + slice / 2 + index * slice}deg)`;
        });
      }
    });
  }

  render() {
    return html`
      <div class="dials">
        <div class="dial dial-day">
          <ul class="ring">
            <li>01</li>
            <li>02</li>
          </ul>
        </div>
        <div class="dial dial-month">
        </div>
        <div class="dial dial-dow">
        </div>
      </div>
    `;
  }
}

window.customElements.define('repa-circular-clock', RepaCircularClock);
