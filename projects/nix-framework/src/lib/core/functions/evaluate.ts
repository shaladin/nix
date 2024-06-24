import { getValue } from "./object.transformer";

export type Restriction = 'EQ' | 'GTE' | 'LTE' | 'GT' | 'LT' | 'NEQ';

export interface Criterion {
  property: string;
  restriction: Restriction;
  value: any;
}

export interface ValidateObject {
  operator: 'AND' | 'OR';
  criteria: Criterion[];
  subject?: string[];
}

function evaluateCriterion(criterion: Criterion, data: any): boolean {
    const propertyMatch = criterion.property.match(/\$\{(.+?)\}/);
    if (!propertyMatch) {
      throw new Error(`Invalid property format: ${criterion.property}`);
    }

    const propertyName  = propertyMatch[1];
    const propertyValue = getValue(propertyName, data);
  
    switch (criterion.restriction.toUpperCase()) {
      case 'EQ':
        return propertyValue === criterion.value;
      case 'NEQ':
        return propertyValue !== criterion.value;
      case 'GT':
        return propertyValue > criterion.value;
      case 'GTE':
        return propertyValue >= criterion.value;
      case 'LT':
        return propertyValue < criterion.value;
      case 'LTE':
        return propertyValue <= criterion.value;
      default:
        throw new Error(`Unsupported restriction: ${criterion.restriction}`);
    }
}
  
export function evaluate(validate: ValidateObject, data: any): boolean {
    const results = validate.criteria.map(criterion => evaluateCriterion(criterion, data));

    if (validate.operator === 'AND') {
        return results.every(result => result);
    } else if (validate.operator === 'OR') {
        return results.some(result => result);
    } else {
        throw new Error(`Unsupported operator: ${validate.operator}`);
    }
}