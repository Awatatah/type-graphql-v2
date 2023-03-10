"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSchemaSync = exports.buildSchema = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const schema_generator_1 = require("../schema/schema-generator");
const emitSchemaDefinitionFile_1 = require("./emitSchemaDefinitionFile");
async function buildSchema(options) {
    const resolvers = loadResolvers(options);
    const schema = await schema_generator_1.SchemaGenerator.generateFromMetadata({ ...options, resolvers });
    if (options.emitSchemaFile) {
        const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
        await (0, emitSchemaDefinitionFile_1.emitSchemaDefinitionFile)(schemaFileName, schema, printSchemaOptions);
    }
    return schema;
}
exports.buildSchema = buildSchema;
function buildSchemaSync(options) {
    const resolvers = loadResolvers(options);
    const schema = schema_generator_1.SchemaGenerator.generateFromMetadataSync({ ...options, resolvers });
    if (options.emitSchemaFile) {
        const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
        (0, emitSchemaDefinitionFile_1.emitSchemaDefinitionFileSync)(schemaFileName, schema, printSchemaOptions);
    }
    return schema;
}
exports.buildSchemaSync = buildSchemaSync;
function loadResolvers(options) {
    // additional runtime check as it should be covered by the `NonEmptyArray` type guard
    if (options.resolvers.length === 0) {
        throw new Error("Empty `resolvers` array property found in `buildSchema` options!");
    }
    return options.resolvers;
}
function getEmitSchemaDefinitionFileOptions(buildSchemaOptions) {
    const defaultSchemaFilePath = path_1.default.resolve(process.cwd(), "schema.gql");
    return {
        schemaFileName: typeof buildSchemaOptions.emitSchemaFile === "string"
            ? buildSchemaOptions.emitSchemaFile
            : typeof buildSchemaOptions.emitSchemaFile === "object"
                ? buildSchemaOptions.emitSchemaFile.path || defaultSchemaFilePath
                : defaultSchemaFilePath,
        printSchemaOptions: typeof buildSchemaOptions.emitSchemaFile === "object"
            ? { ...emitSchemaDefinitionFile_1.defaultPrintSchemaOptions, ...buildSchemaOptions.emitSchemaFile }
            : emitSchemaDefinitionFile_1.defaultPrintSchemaOptions,
    };
}
//# sourceMappingURL=buildSchema.js.map