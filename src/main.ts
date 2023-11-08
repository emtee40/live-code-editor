// SPDX-FileCopyrightText: 2023 Kamila Borowska <kamila@borowska.pw>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import "./style.css";
import { Compartment } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
function onChange() {
  const doc = editor.state.doc.toString();
  localStorage.setItem("code", doc);
  (document.getElementById("preview") as HTMLIFrameElement).srcdoc = doc;
}
var timeout: ReturnType<typeof setTimeout> | null = null;
function debounceChanges() {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function callOnChange() {
    onChange();
  }, 300);
}
const language = new Compartment();
const editor = new EditorView({
  doc:
    localStorage.getItem("code") ||
    "<!DOCTYPE html>\n" +
      "<p> Welcome to the real-time HTML editor. Type HTML in " +
      "the textarea above, and it will appear in a frame below.",
  extensions: [
    basicSetup,
    language.of([]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) debounceChanges();
    }),
  ],
  parent: document.getElementById("editor") as HTMLElement,
});
(async () => {
  const { html } = await import("@codemirror/lang-html");
  editor.dispatch({ effects: language.reconfigure(html()) });
})();
onChange();
