export namespace DBConfia_Seguridad {
        
    export interface IOcupacionesModulos {
              
        Id: number
      
        OcupacionId: number
      
        RolID: number
      
        CreacionUsuarioID: number
      
        CreacionPersonaID: number
      
        CreacionFecha: string

    }
    export interface IPermisosGlobalesVW {
              
        UsuarioID: number
      
        ProductoID: number
      
        ProductoNombre: string
      
        ProductoActivo?: boolean
      
        ProductoPrincipal?: boolean
      
        EmpresaId?: number
      
        EmpresaNombre?: string
      
        ModuloID?: number
      
        ModuloNombre?: string
      
        ModuloRuta?: string
      
        ModuloColorFondo?: string
      
        ModuloColorBorde?: string
      
        ModuloColorFuente?: string
      
        ModuloIcono?: string
      
        ModuloRequiereProducto?: boolean
      
        PantallaID?: number
      
        PantallaNombre?: string
      
        PantallaDescripcion?: string
      
        PantallaRuta?: string
      
        PermisoID?: number
      
        PermisoNombre?: string
      
        PermisoDescripcion?: string
      
        PermisoEspecial?: boolean
      
        PermisoRestUrl?: string
      
        PermisoRestMetodo?: string

    }
    export interface IRoles {
              
        RolID: number
      
        Nombre: string
      
        Descripcion: string
      
        Icono: string
      
        CreacionFecha: string
      
        RequiereProducto: boolean
      
        SeccionRolID?: number

    }
    export interface IRoles_Pantallas {
              
        RolPantallaID: number
      
        RolID: number
      
        PantallaID: number
      
        Descripcion: string
      
        CreacionFecha: string

    }
    export interface IRoles_Permisos {
              
        RolPermisoID: number
      
        RolID: number
      
        PermisoID: number
      
        Creacion: string
      
        CreacionUsuarioID: number

    }
    export interface IRolesPermisosVW {
              
        RolID: number
      
        RolPermiso__Descripcion: string
      
        ModuloID?: number
      
        ModuloNombre?: string
      
        ModuloRuta?: string
      
        ModuloColorFondo?: string
      
        ModuloColorBorde?: string
      
        ModuloColorFuente?: string
      
        ModuloIcono?: string
      
        ModuloRequiereProducto?: boolean
      
        PantallaID?: number
      
        PantallaNombre?: string
      
        PantallaDescripcion?: string
      
        PantallaRuta?: string
      
        PermisoID?: number
      
        PermisoNombre?: string
      
        PermisoDescripcion?: string
      
        PermisoEspecial?: boolean
      
        PermisoRestUrl?: string
      
        PermisoRestMetodo?: string

    }
    export interface ISeccionesRoles {
              
        SeccionRolID: number
      
        Nombre: string
      
        Descripcion: string

    }
    export interface IUsuarios {
              
        UsuarioID: number
      
        Usuario: string
      
        Nombre: string
      
        Correo?: string
      
        Contrasena: string
      
        Bloqueado: boolean
      
        BloqueadoPermanente: boolean
      
        MasterUser: boolean
      
        SystemUser: boolean
      
        SupportUser: boolean
      
        TodosLosCoordinadores: boolean
      
        fhAlta: string
      
        fhUltimoAcceso?: string
      
        fhBloqueo?: string
      
        fhUltimoCambioContrasena?: string
      
        usuarioIdBloquea?: number
      
        comentarioBloqueo?: string
      
        Validacion: boolean
      
        ValidacionCodigo?: string
      
        ValidacionFecha?: string
      
        ContratantePagos?: number
      
        MasterPagos?: boolean
      
        ContrasenaRestablecida: boolean
      
        UUID?: string
      
        empresaId?: number
      
        AccesoAppValesPS?: boolean
      
        AccesoAppCobranzaPS?: boolean
      
        PersonaID: number

    }
    export interface IUsuarios_PermisosEspeciales {
              
        UsuarioPermisoEspecialID: number
      
        UsuarioID: number
      
        ProductoID?: number
      
        PermisoID: number
      
        CreacionFecha: string
      
        CreacionUsuarioID: number

    }
    export interface IUsuarios_PermisosEspeciales_VW {
              
        PantallaDescripcion?: string
      
        NombreModulo?: string
      
        PermisoID?: number
      
        PantallaID?: number
      
        Nombre?: string
      
        Descripcion?: string
      
        Especial?: boolean
      
        RestUrl?: string
      
        RestMetodo?: string
      
        CreacionFecha?: string

    }
    export interface IUsuarios_Personas {
              
        PersonaID: number
      
        UsuarioID: number
      
        Activo: boolean
      
        FechaAlta: string
      
        FechaModificacion?: string
      
        FechaBaja?: string

    }
    export interface IUsuarios_PEspeciales_Asignados_VW {
              
        UsuarioPermisoEspecialID: number
      
        ProductoID?: number
      
        Producto?: string
      
        PermisoID?: number
      
        Descripcion?: string
      
        CreacionFecha: string
      
        UsuarioID?: number
      
        Nombre?: string

    }
    export interface IUsuarios_Roles {
              
        UsuarioRolID: number
      
        UsuarioID: number
      
        ProductoID?: number
      
        RolID: number
      
        CreacionFecha: string
      
        CreacionUsuarioID: number

    }
    export interface IUsuariosPermisosVW {
              
        UsuarioID: number
      
        ProductoID?: number
      
        ModuloID?: number
      
        ModuloNombre?: string
      
        ModuloRuta?: string
      
        ModuloColorFondo?: string
      
        ModuloColorBorde?: string
      
        ModuloColorFuente?: string
      
        ModuloIcono?: string
      
        ModuloRequiereProducto?: boolean
      
        PantallaID?: number
      
        PantallaNombre?: string
      
        PantallaDescripcion?: string
      
        PantallaRuta?: string
      
        PermisoID?: number
      
        PermisoNombre?: string
      
        PermisoDescripcion?: string
      
        PermisoEspecial?: boolean
      
        PermisoRestUrl?: string
      
        PermisoRestMetodo?: string
      
        ProductoNombre?: string
      
        ProductoActivo?: boolean
      
        ProductoPrincipal?: boolean
      
        EmpresaId?: number
      
        EmpresaNombre?: string

    }
    export interface IUsuariosPersonasPuestos_VW {
              
        PersonaID: number
      
        NombreCompleto: string
      
        SACId?: number
      
        UsuarioID: number
      
        Usuario: string
      
        Ocupacion?: string
      
        PuestoCV?: number

    }
    export interface IUsuariosPersonasPuestosVW {
              
        PersonaID: number
      
        NombreCompleto: string
      
        SACId?: number
      
        UsuarioID: number
      
        Usuario: string
      
        Ocupacion?: string
      
        PuestoCV?: number
      
        EsGestor?: number
      
        EsDirector?: number

    }
    export interface IUsuariosRolesVW {
              
        UsuarioRolID: number
      
        UsuarioID: number
      
        RolID: number
      
        ProductoID?: number
      
        EmpresaId: number
      
        ProductoNombre: string
      
        ProductoActivo: boolean
      
        EmpresaNombre?: string

    }
    export interface IUsuariosVW {
              
        GestorCobranzaID?: number
      
        UUID?: string
      
        AccesoAppValesPS?: boolean
      
        AccesoAppCobranzaPS?: boolean
      
        DistribuidorID?: number
      
        DistribuidorValidado: number
      
        AccesoAppVales?: boolean
      
        AccesoAppCobranza?: boolean
      
        empresaId?: number
      
        empresaNombre?: string
      
        Producto?: string
      
        ProductoID?: number
      
        GrupoID?: number
      
        UsuarioID: number
      
        Usuario: string
      
        Nombre: string
      
        NombreCompleto: string
      
        Correo: string
      
        Contrasena: string
      
        CorreoElectronico?: string
      
        Validacion: boolean
      
        Bloqueado: boolean
      
        BloqueadoPermanente: boolean
      
        MasterUser: boolean
      
        SupportUser: boolean
      
        SystemUser: boolean
      
        PersonaID?: number
      
        PersonaPersonaID?: number
      
        PersonaNombre?: string
      
        PersonaApellidoPaterno?: string
      
        PersonaApellidoMaterno?: string
      
        PersonaTelefonoMovil?: string
      
        ContratantePagos?: number
      
        MasterPagos?: boolean
      
        usuario_empresaId?: number
      
        usuario_empresaNombre?: string
      
        usuario_empresaPrefijoApp?: string
      
        creditoPromotorId?: number
      
        SucursalIDPromotor?: number
      
        ProductoIDPromotor?: number

    }
}