import { MetadataStorage } from "../metadata/metadata-storage";
declare global {
    var TypeGraphQLMetadataStorage: MetadataStorage;
}
export declare function getMetadataStorage(): MetadataStorage;
