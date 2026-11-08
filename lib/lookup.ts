import attributes from "../data/attributes.json";
import facts from "../data/facts.json";
import securities from "../data/securities.json";
import { Attribute } from "../models/attribute";
import { Security } from "../models/security";

interface RawFact {
  security_id: number;
  attribute_id: number;
  value: number;
}

const securitiesData = securities as Security[];
const attributesData = attributes as Attribute[];
const factsData = facts as RawFact[];

export function findSecurityBySymbol(symbol: string): Security | undefined {
  return securitiesData.find((security) => security.symbol === symbol);
}

export function findAttributeByName(name: string): Attribute | undefined {
  return attributesData.find((attribute) => attribute.name === name);
}

export function getFactValue(
  securityId: number,
  attributeId: number,
): number | undefined {
  const fact = factsData.find(
    (entry) =>
      entry.security_id === securityId && entry.attribute_id === attributeId,
  );

  return fact?.value;
}
