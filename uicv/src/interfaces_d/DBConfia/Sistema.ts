export namespace DBConfia_Sistema {
        
    export interface IFunciones {
              
        FuncionID: number
      
        Funcion: string

    }
    export interface IFuncionesUsuario {
              
        FuncionID: number
      
        Permiso: boolean
      
        UsuarioID: number

    }
    export interface ILogs {
              
        SistemaLogID: number
      
        eventoTipoId: number
      
        FHRegistro: string
      
        Referencia: number
      
        observaciones?: string
      
        valorAnterior?: string
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface IModulos {
              
        ModuloID: number
      
        Nombre: string
      
        Etiqueta: string
      
        ColorFondo: string
      
        ColorBorde: string
      
        ColorFuente: string
      
        Icono: string
      
        Ruta: string
      
        RequiereProducto: boolean
      
        CreacionFecha: string

    }
    export interface IPantallas {
              
        PantallaID: number
      
        ModuloID: number
      
        Nombre: string
      
        Descripcion: string
      
        Ruta: string
      
        CreacionFecha: string

    }
    export interface IPantallas_VW {
              
        ModuloID: number
      
        ModuloNombre: string
      
        ModuloRuta: string
      
        ModuloColorFondo: string
      
        ModuloColorBorde: string
      
        ModuloColorFuente: string
      
        PantallaID: number
      
        PantallaNombre: string
      
        PantallaDescripcion: string
      
        PantallaRuta: string

    }
    export interface IPermisos {
              
        PermisoID: number
      
        PantallaID: number
      
        Nombre: string
      
        Descripcion: string
      
        Especial: boolean
      
        RestUrl: string
      
        RestMetodo: string
      
        CreacionFecha: string

    }
    export interface IPermisos_VW {
              
        ModuloID: number
      
        ModuloNombre: string
      
        ModuloRuta: string
      
        ModuloColorFondo: string
      
        ModuloColorBorde: string
      
        ModuloColorFuente: string
      
        ModuloIcono: string
      
        ModuloRequiereProducto: boolean
      
        PantallaID: number
      
        PantallaNombre: string
      
        PantallaDescripcion: string
      
        PantallaRuta: string
      
        PermisoID: number
      
        PermisoNombre: string
      
        PermisoDescripcion: string
      
        PermisoEspecial: boolean
      
        PermisoRestUrl: string
      
        PermisoRestMetodo: string

    }
    export interface IPermisosEspeciales_VW {
              
        PermisoID: number
      
        Nombre: string
      
        Descripcion: string
      
        Especial: boolean
      
        NombrePantalla?: string
      
        DescPantalla?: string
      
        NombreModulo?: string
      
        Etiqueta?: string
      
        RequiereProducto?: boolean

    }
}