/**
 * @license
 * Copyright 2022 Gyuri Horák <dyuri@horak.hu>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DOWS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

/**
 * Circular clock element.
 *
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

      .ring li[active] {
        color: var(--active-color, #fff);
      }

      .dial-day {
        --dial-size: 90%;
        --active-color: #98971a;
      }

      .dial-month {
        --dial-size: calc(90% - 4em);
        --active-color: #d79912;
      }

      .dial-dow {
        --dial-size: calc(90% - 8em);
        --active-color: #cc241d;
      }
    `;
  }

  static get properties() {
    return {
      date: { type: String, reflect: true },
      tick: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.date = new Date().toISOString();
    this.tick = false;
  }

  firstUpdated() {
    super.firstUpdated();
    this._initFields();
  }

  updated(changedProperties) {
    // TODO check old date vs new date
    super.updated(changedProperties);
    this._rotateRings();
  }

  set date(date) {
    const oldDate = this._date;
    if (date) {
      this._date = new Date(date);
    }
    this.requestUpdate('date', oldDate);
  }

  get date() {
    return this._date?.toISOString();
  }

  get day() {
    return this._date?.getDate();
  }

  get month() {
    return this._date?.getMonth() + 1;
  }

  get dayOfWeek() {
    return this._date?.getDay();
  }

  daysInMonth(month, year) {
    if (!this._date) {
      this._date = new Date();
    }
    if (!year) {
      year = this._date.getFullYear();
    }
    if (!month) {
      month = this._date.getMonth() + 1;
    }
    const nrOfDays = new Date(year, month, 0).getDate();
    return Array(nrOfDays).fill(0).map((_, index) => index + 1);
  }

  _initFields() {
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

  _rotateRing(ring, pos) {
    if (ring) {
      const fields = ring.querySelectorAll('li');
      const length = fields.length;
      if (length > 0) {
        const slice = 270 / length;
        ring.style.transform = `rotate(${135 - slice / 2 - (pos - 1) * slice}deg)`;
      }
      fields.forEach((field, index) => {
        if (field.hasAttribute("active") && index !== pos - 1) {
          field.removeAttribute("active");
        } else if (!field.hasAttribute("active") && index === pos - 1) {
          field.setAttribute("active", "");
        }
      });
    }
  }

  _rotateRings() {
    this._rotateRing(this.shadowRoot.querySelector(".dial-day .ring"), this.day);
    this._rotateRing(this.shadowRoot.querySelector(".dial-month .ring"), this.month);
    this._rotateRing(this.shadowRoot.querySelector(".dial-dow .ring"), this.dayOfWeek);
  }

  render() {
    return html`
      <div class="dials">
        <div class="dial dial-day">
          <ul class="ring">
            ${this.daysInMonth().map(d => html`<li>${d < 10 ? '0' + d : d}</li>`)}
          </ul>
        </div>
        <div class="dial dial-month">
          <ul class="ring">
            ${MONTHS.map(m => html`<li>${m}</li>`)}
          </ul>
        </div>
        <div class="dial dial-dow">
          <ul class="ring">
            ${DOWS.map(d => html`<li>${d}</li>`)}
          </ul>
        </div>
      </div>
    `;
  }
}

window.customElements.define('repa-circular-clock', RepaCircularClock);
