import { ExpressionOperator } from "@core/enums/expression-operator";

export interface SearchExpression {
    field: string;
    operator: ExpressionOperator;
    value: string;
}