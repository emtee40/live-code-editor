// SPDX-FileCopyrightText: 2023 Konrad Borowski <konrad@borowski.pw>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { remote } from "webdriverio";
import { preview } from "vite";
import { expect, test } from "vitest";

const PORT = 3000;

test("works", async () => {
  const server = await preview({ preview: { port: PORT } });
  try {
    const browser = await remote({
      capabilities: {
        browserName: "firefox",
        "moz:firefoxOptions": {
          args: ["-headless"],
        },
      },
    });
    try {
      await browser.url(`http://localhost:${PORT}/live/`);
      const textbox = await browser.$(".cm-content");
      await textbox.click();
      await textbox.setValue("<b>Hello, world!");
      const outputFrame = await browser.$("iframe");
      await browser.switchToFrame(outputFrame);
      const bold = browser.$("b");
      await bold.waitForExist();
      expect(await bold.getText()).toBe("Hello, world!");
    } finally {
      await browser.deleteSession();
    }
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
}, 60_000);
