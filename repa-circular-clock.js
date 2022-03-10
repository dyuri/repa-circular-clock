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

      .dial::before {
        content: "";
        inset: 0;
        margin: auto;
        position: absolute;
        display: block;
        width: calc(100% - .45em);
        height: calc(100% - .45em);
        border: 1.5em solid #222;
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

      .dial.full .ring {
        border-bottom-color: #333;
      }

      .ring li {
        position: absolute;
        top: -1.5em;
        left: -1.5em;
        height: calc(100% + 3em);
        width: calc(100% + 3em);
        text-align: center;
        transition: color .5s;
      }

      .ring li[active] {
        color: var(--active-color, #fff);
        z-index: 1;
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

      .dial-hour {
        --dial-size: calc(90% - 12em);
        --active-color: #fff;
      }

      .dial-min {
        --dial-size: calc(90% - 14em);
        --active-color: #ddd;
      }

      .dial-sec {
        --dial-size: calc(90% - 16em);
        --active-color: #aaa;
      }

      .dial-hour::before,
      .dial-min::before,
      .dial-sec::before {
        display: none;
      }

      .dial-hour .ring,
      .dial-min .ring,
      .dial-sec .ring {
        font-size: .5em;
      }

      .dial-min .ring li:not([active]),
      .dial-sec .ring li:not([active]) {
        color: transparent;
      }

      .dial-min .ring li:nth-child(10n+1):not([active]),
      .dial-sec .ring li:nth-child(10n+1):not([active]) {
        color: inherit;
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
    this.tick = true;
  }

  firstUpdated() {
    super.firstUpdated();
    this._initFields();
    if (this.tick) {
      this._tick();
    }
  }

  _tick() {
    this.date = new Date().toISOString();
    this._ticking = setTimeout(() => this._tick(), 1000);
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

  get hour() {
    return this._date?.getHours();
  }

  get minute() {
    return this._date?.getMinutes();
  }

  get second() {
    return this._date?.getSeconds();
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
      const deg = ring.classList.contains('full') ? 360 : 270;
      const fields = ring.querySelectorAll('li');
      const length = fields.length;
      if (length > 0) {
        const slice = deg / length;
        fields.forEach((field, index) => {
          field.style.transform = `rotate(${- deg/2 + slice / 2 + index * slice}deg)`;
        });
      }
    });
  }

  _rotateRing(ring, pos) {
    if (ring) {
      const deg = ring.classList.contains('full') ? 360 : 270;
      const fields = ring.querySelectorAll('li');
      const length = fields.length;
      if (length > 0) {
        const slice = deg / length;
        ring.style.transform = `rotate(${deg/2 - slice / 2 - pos * slice}deg)`;
      }
      fields.forEach((field, index) => {
        if (field.hasAttribute("active") && index !== pos) {
          field.removeAttribute("active");
        } else if (!field.hasAttribute("active") && index === pos) {
          field.setAttribute("active", "");
        }
      });
    }
  }

  _rotateRings() {
    this._rotateRing(this.shadowRoot.querySelector(".dial-day .ring"), this.day - 1);
    this._rotateRing(this.shadowRoot.querySelector(".dial-month .ring"), this.month - 1);
    this._rotateRing(this.shadowRoot.querySelector(".dial-dow .ring"), this.dayOfWeek == 0 ? 6 : (this.dayOfWeek - 1));
    this._rotateRing(this.shadowRoot.querySelector(".dial-hour .ring"), this.hour);
    this._rotateRing(this.shadowRoot.querySelector(".dial-min .ring"), this.minute);
    this._rotateRing(this.shadowRoot.querySelector(".dial-sec .ring"), this.second);
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
        <div class="dial dial-hour full">
          <ul class="ring full">
            ${Array(24).fill(0).map((_, i) => html`<li>${i < 10 ? '0' + i : i}</li>`)}
          </ul>
        </div>
        <div class="dial dial-min full">
          <ul class="ring full">
            ${Array(60).fill(0).map((_, i) => html`<li>${i < 10 ? '0' + i : i}</li>`)}
          </ul>
        </div>
        <div class="dial dial-sec full">
          <ul class="ring full">
            ${Array(60).fill(0).map((_, i) => html`<li>${i < 10 ? '0' + i : i}</li>`)}
          </ul>
        </div>
      </div>
    `;
  }
}

window.customElements.define('repa-circular-clock', RepaCircularClock);
