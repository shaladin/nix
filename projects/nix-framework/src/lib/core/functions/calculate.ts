import { create, all } from 'mathjs';
import { getValue } from './object.transformer';

const math = create(all, {});

/**
 * Replace placeholders in the formula with their corresponding values from the context.
 * @param {string} formula - The formula with placeholders.
 * @param {Record<string, any>} context - The context object containing values for placeholders.
 * @returns {string} - The formula with placeholders replaced by their corresponding values.
 */
function evaluate(formula: string, context: Record<string, any>): string {
    return formula.replace(/\$\{([^}]+)\}/g, (_, expression) => getValue(expression, context));
}

/**
 * Calculate the formula using mathjs after replacing placeholders with their values.
 * @param {string} formula - The formula with placeholders.
 * @param {Record<string, any>} context - The context object containing values for placeholders.
 * @returns {number} - The result of the evaluated formula.
 */
export function calculate(formula: string, context: Record<string, any>): {Result: number} {
    const evaluated = evaluate(formula, context);
    const compiled  = math.compile(evaluated);
    return {
        Result: compiled.evaluate(context)
    };
}
  