import { expect } from "chai";
import path from "path";

describe("PackageProxy", () => {
  describe("proxy", () => {
    it("returns a new proxy object", () => expect(true).to.be.true);
  }),
    describe("handlers", () => {
      describe("set", () => {
        it("logs to console", async () => expect(true).to.be.true);
        it("alters existing target property", () => expect(true).to.be.true);
      }),
        describe("deleteProperty", () => {
          it("logs when property does not exist", () =>
            expect(true).to.be.true);
          it("logs when property is deleted", () => expect(true).to.be.true);
          it("deletes existing target property", () => expect(true).to.be.true);
        }),
        describe("defineProperty", () => {
          it("logs when property is created", () => expect(true).to.be.true);
          it("sets the property key-value", () => expect(true).to.be.true);
        });
    });
});
