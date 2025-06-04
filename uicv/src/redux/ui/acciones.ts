import { IAccion } from '../../interfaces/redux/IAccion'
import { IModulo } from '../../interfaces/seguridad/IModulo'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { IProducto } from '../../interfaces/seguridad/IProducto'
import { IDireccionIP } from '../../interfaces/seguridad/IDireccionIP'
import * as st from './tipos'

export const DefinirSidebar = (Payload: boolean): IAccion => ({ Payload, type: st.SIDEBAR_CAMBIAR })
export const DefinirModulo = (Payload: { Producto?: IProducto, Modulo?: IModulo, Permisos: IPermiso[], DirIP?: string }): IAccion => ({ Payload, type: st.DEFINIR_MODULO })
export const DefinirPermisos = (Payload: { DireccionIP: IDireccionIP, PermisosGenerales: IPermiso[], PermisosProductos: IModulo[], PermisosExportar: IModulo[] }): IAccion => ({ Payload, type: st.PERMISOS_SERVIDOR })




