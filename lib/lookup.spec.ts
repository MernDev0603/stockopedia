import {
  findAttributeByName,
  findSecurityBySymbol,
  getFactValue,
} from "./lookup";

describe("lookup", () => {
  describe("findSecurityBySymbol", () => {
    it("returns the security when the symbol exists", () => {
      expect(findSecurityBySymbol("ABC")).toEqual({ id: 1, symbol: "ABC" });
    });

    it("returns undefined when the symbol does not exist", () => {
      expect(findSecurityBySymbol("ZZZ")).toBeUndefined();
    });
  });

  describe("findAttributeByName", () => {
    it("returns the attribute when the name exists", () => {
      expect(findAttributeByName("sales")).toEqual({ id: 4, name: "sales" });
    });

    it("returns undefined when the name does not exist", () => {
      expect(findAttributeByName("unknown")).toBeUndefined();
    });
  });

  describe("getFactValue", () => {
    it("returns the fact value for a security and attribute", () => {
      // ABC (id 1) sales (id 4) => 4
      expect(getFactValue(1, 4)).toBe(4);
    });

    it("returns undefined when no fact exists", () => {
      expect(getFactValue(999, 999)).toBeUndefined();
    });
  });
});
