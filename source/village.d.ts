import { Modeler } from "vineyard-ground";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
}
export declare class Village<Model extends ModelInterface> {
    private model;
    private db;
    private secrets;
    private general;
    private rootPath;
    constructor();
    load(filename: any): any;
    getModel(): Model;
    getSecrets(): any;
    getGeneral(): any;
    getGround(): Modeler;
    createModel(schema: any): any;
}
