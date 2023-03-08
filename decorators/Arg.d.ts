import { ReturnTypeFunc, DecoratorTypeOptions, DescriptionOptions, ValidateOptions, DeprecationOptions } from "./types";
export type ArgOptions = DecoratorTypeOptions & DescriptionOptions & ValidateOptions & DeprecationOptions;
export declare function Arg(name: string, options?: ArgOptions): ParameterDecorator;
export declare function Arg(name: string, returnTypeFunc: ReturnTypeFunc, options?: ArgOptions): ParameterDecorator;
