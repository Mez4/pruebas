import { DBConfia_Seguridad } from "../../interfaces_db/DBConfia/Seguridad";
import { IPersonaVW } from "../catalogos/IPersonaVW";
import { IPersona } from "../oidc/IPersona";
import { IUsuarioOidc } from "../oidc/IUsuarioOidc";
import { IDireccionIP } from "../seguridad/IDireccionIP";
import { IModulo } from "../seguridad/IModulo";
import { IPermiso } from "../seguridad/IPermiso";
import { IProducto } from "../seguridad/IProducto"

export interface iUI {

    // Is the sidebar open
    Sidebar: boolean,

    // Acceso General del servicio web
    DireccionIP?: IDireccionIP,
    PermisosGenerales?: IPermiso[],
    PermisosProductos?: IPermiso[],
    PermisosExportar?: IPermiso[],

    // Producto seleccionado
    Producto?: IProducto,
    Modulo?: IModulo,
    Persona?: DBConfia_Seguridad.IUsuariosVW

    // Permisos actuales
    Permisos: IPermiso[]
}