import { iUI } from './../ui/iUI';
import { ICatalogos } from "../catalogos/ICatalogos"
import { IOidc } from "../oidc/IOidc"
import { IDireccionIP } from '../seguridad/IDireccionIP';

export interface IEstado {
    oidc: IOidc,
    Catalogos: ICatalogos,
    Cache: any,
    UI: iUI
}