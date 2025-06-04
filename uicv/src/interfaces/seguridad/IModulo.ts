import { IPermiso } from './IPermiso'

export interface IModulo {
    ModuloID: number,
    ModuloNombre: string,
    ModuloIcono: string,
    ModuloColorBorde: string,
    ModuloColorFondo: string,
    ModuloColorFuente: string,
    ModuloRuta: string,
    DirIP?: string,
}