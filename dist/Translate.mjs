(function(){"use strict";try{if(typeof document!="undefined"){var t=document.createElement("style");t.appendChild(document.createTextNode("._rotate-cw_1fod5_1{animation:_rotate-cw_1fod5_1 .3s ease-in infinite}._rotate-ccw_1fod5_5{animation:_rotate-ccw_1fod5_5 .2s ease-out}@keyframes _rotate-cw_1fod5_1{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _rotate-ccw_1fod5_5{0%{transform:rotate(0)}to{transform:rotate(-360deg)}}")),document.head.appendChild(t)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
var o = Object.defineProperty;
var i = (r, t, e) => t in r ? o(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var n = (r, t, e) => (i(r, typeof t != "symbol" ? t + "" : t, e), e);
const a = {
  "rotate-cw": "_rotate-cw_1fod5_1",
  "rotate-ccw": "_rotate-ccw_1fod5_5"
}, l = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 17C8 14.5 12 12 13 9"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.5 11C8.5 11 10 14 12.5 15"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7.7H16M11 7.7V5.7"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.5 18L15.2143 16M15.2143 16L16.9159 11.2354C16.9663 11.0942 17.1001 11 17.25 11C17.3999 11 17.5337 11.0942 17.5841 11.2354L19.2857 16M15.2143 16H19.2857M20 18L19.2857 16"/></svg>';
class h {
  constructor({ config: t, api: e }) {
    n(this, "api");
    n(this, "config");
    n(this, "nodes");
    n(this, "originalText");
    this.config = t, this.api = e, this.nodes = {
      wrapper: null,
      buttonTranslate: null
    }, this.originalText = "";
  }
  static get isInline() {
    return !0;
  }
  static get title() {
    return "Translate";
  }
  render() {
    return this.nodes.wrapper = document.createElement("button"), this.nodes.wrapper.classList.add(this.api.styles.inlineToolButton), this.nodes.wrapper.type = "button", this.nodes.buttonTranslate = document.createElement("span"), this.nodes.buttonTranslate.innerHTML = l, this.nodes.wrapper.appendChild(this.nodes.buttonTranslate), this.nodes.wrapper;
  }
  async surround(t) {
    if (this.originalText) {
      this.toggleAnimatedButton("ccw"), t.deleteContents(), t.insertNode(document.createTextNode(this.originalText)), setTimeout(() => {
        this.toggleAnimatedButton("ccw", !1);
      }, 300), this.select(t), this.originalText = "";
      return;
    }
    const e = t.toString();
    if (!e)
      return;
    this.toggleAnimatedButton("cw");
    const s = await this.translate(e);
    this.toggleAnimatedButton("cw", !1), s && (this.originalText = e, t.deleteContents(), t.insertNode(document.createTextNode(s)), this.select(t));
  }
  checkState() {
    return !1;
  }
  select(t) {
    const e = window.getSelection();
    !e || (e.removeAllRanges(), e.addRange(t));
  }
  async translate(t) {
    if (!!t)
      try {
        if (!this.config.endpoint)
          throw new Error("Translation endpoint is not specified");
        let e;
        try {
          e = await fetch(`${this.config.endpoint}${t}`);
        } catch {
          throw new Error("Translation server is not available");
        }
        if (e.status !== 200)
          throw new Error("Bad response from translation server");
        const s = await e.json();
        if (s.status == "error")
          throw new Error(`Server error: ${s.message}`);
        return s.message;
      } catch (e) {
        this.api.notifier.show({
          message: e.message,
          style: "error"
        });
      }
  }
  toggleAnimatedButton(t, e = !0) {
    !this.nodes.buttonTranslate || this.nodes.buttonTranslate.classList.toggle(a[`rotate-${t}`], e);
  }
}
export {
  h as default
};
