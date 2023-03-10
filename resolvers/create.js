"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapResolverWithAuthChecker = exports.createBasicFieldResolver = exports.createAdvancedFieldResolver = exports.createHandlerResolver = void 0;
const tslib_1 = require("tslib");
const helpers_1 = require("./helpers");
const types_1 = require("../helpers/types");
const build_context_1 = require("../schema/build-context");
const isPromiseLike_1 = tslib_1.__importDefault(require("../utils/isPromiseLike"));
const auth_middleware_1 = require("../helpers/auth-middleware");
function createHandlerResolver(resolverMetadata) {
    const { validate: globalValidate, authChecker, authMode, pubSub, globalMiddlewares, container, } = build_context_1.BuildContext;
    const middlewares = globalMiddlewares.concat(resolverMetadata.middlewares);
    (0, helpers_1.applyAuthChecker)(middlewares, authChecker, container, authMode, resolverMetadata.roles);
    return (root, args, context, info) => {
        const resolverData = { root, args, context, info };
        const targetInstanceOrPromise = container.getInstance(resolverMetadata.target, resolverData);
        if ((0, isPromiseLike_1.default)(targetInstanceOrPromise)) {
            return targetInstanceOrPromise.then(targetInstance => (0, helpers_1.applyMiddlewares)(container, resolverData, middlewares, () => {
                const params = (0, helpers_1.getParams)(resolverMetadata.params, resolverData, globalValidate, pubSub);
                if ((0, isPromiseLike_1.default)(params)) {
                    return params.then(resolvedParams => targetInstance[resolverMetadata.methodName].apply(targetInstance, resolvedParams));
                }
                else {
                    return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
                }
            }));
        }
        return (0, helpers_1.applyMiddlewares)(container, resolverData, middlewares, () => {
            const params = (0, helpers_1.getParams)(resolverMetadata.params, resolverData, globalValidate, pubSub);
            const targetInstance = targetInstanceOrPromise;
            if ((0, isPromiseLike_1.default)(params)) {
                return params.then(resolvedParams => targetInstance[resolverMetadata.methodName].apply(targetInstance, resolvedParams));
            }
            else {
                return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
            }
        });
    };
}
exports.createHandlerResolver = createHandlerResolver;
function createAdvancedFieldResolver(fieldResolverMetadata) {
    if (fieldResolverMetadata.kind === "external") {
        return createHandlerResolver(fieldResolverMetadata);
    }
    const targetType = fieldResolverMetadata.getObjectType();
    const { validate: globalValidate, authChecker, authMode, pubSub, globalMiddlewares, container, } = build_context_1.BuildContext;
    const middlewares = globalMiddlewares.concat(fieldResolverMetadata.middlewares);
    (0, helpers_1.applyAuthChecker)(middlewares, authChecker, container, authMode, fieldResolverMetadata.roles);
    return (root, args, context, info) => {
        const resolverData = { root, args, context, info };
        const targetInstance = (0, types_1.convertToType)(targetType, root);
        return (0, helpers_1.applyMiddlewares)(container, resolverData, middlewares, () => {
            const handlerOrGetterValue = targetInstance[fieldResolverMetadata.methodName];
            if (typeof handlerOrGetterValue !== "function") {
                // getter
                return handlerOrGetterValue;
            }
            // method
            const params = (0, helpers_1.getParams)(fieldResolverMetadata.params, resolverData, globalValidate, pubSub);
            if ((0, isPromiseLike_1.default)(params)) {
                return params.then(resolvedParams => handlerOrGetterValue.apply(targetInstance, resolvedParams));
            }
            else {
                return handlerOrGetterValue.apply(targetInstance, params);
            }
        });
    };
}
exports.createAdvancedFieldResolver = createAdvancedFieldResolver;
function createBasicFieldResolver(fieldMetadata) {
    const { authChecker, authMode, globalMiddlewares, container } = build_context_1.BuildContext;
    const middlewares = globalMiddlewares.concat(fieldMetadata.middlewares);
    (0, helpers_1.applyAuthChecker)(middlewares, authChecker, container, authMode, fieldMetadata.roles);
    return (root, args, context, info) => {
        const resolverData = { root, args, context, info };
        return (0, helpers_1.applyMiddlewares)(container, resolverData, middlewares, () => root[fieldMetadata.name]);
    };
}
exports.createBasicFieldResolver = createBasicFieldResolver;
function wrapResolverWithAuthChecker(resolver, container, roles) {
    const { authChecker, authMode } = build_context_1.BuildContext;
    if (!authChecker || !roles) {
        return resolver;
    }
    return (root, args, context, info) => {
        const resolverData = { root, args, context, info };
        return (0, auth_middleware_1.AuthMiddleware)(authChecker, container, authMode, roles)(resolverData, async () => resolver(root, args, context, info));
    };
}
exports.wrapResolverWithAuthChecker = wrapResolverWithAuthChecker;
//# sourceMappingURL=create.js.map