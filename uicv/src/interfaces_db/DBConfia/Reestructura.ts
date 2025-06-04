export namespace DBConfia_Reestructura {
        
    export interface IAnalistaSucursales {
              
        AnalistaSucursales_ID: number
      
        ProductoID?: number
      
        SucursalID?: number
      
        AnalistaID?: number

    }
    export interface IAnalistaSucursales_VW {
              
        SucursalID: number
      
        Nombre: string
      
        ProductoID?: number
      
        PersonaID: number

    }
    export interface IClientesFinales {
              
        ClienteFinalID: number
      
        ClienteID?: number
      
        CreditoID?: number
      
        SaldoActual?: number
      
        PersonaRegistraID?: number
      
        UsuarioRegistraID?: number
      
        FechaRegistra?: string
      
        SolicitudID?: number

    }
    export interface IDocumentos {
              
        DocumentoID: number
      
        TipoDocumentoID: number
      
        DistribuidorID: number
      
        Ruta?: string
      
        Status?: string
      
        Autorizado?: boolean
      
        SolicitudRCID?: number

    }
    export interface IDocumentos_VW {
              
        ProductoID: number
      
        TipoDocumentoID: number
      
        Opcional: boolean
      
        NombreDocumento: string
      
        Descripcion: string

    }
    export interface IEstatusSolicitud {
              
        Estatus: string
      
        Descripcion: string

    }
    export interface IHerramientasDeRescate {
              
        HDRID: number
      
        MontoIntencion: number
      
        ComentariosSolicitud: string
      
        ComentariosCancelacion?: string
      
        CanceladoBit?: boolean
      
        SaldoActual: number
      
        SaldoAtrasado: number
      
        Plazos: number
      
        FechaRegistro: string
      
        UsuarioRegistra: number
      
        PersonaRegistra: number
      
        DistribuidorID: number
      
        TipoHerramientaID: number

    }
    export interface IPlazos {
              
        PlazoID: number
      
        Quincenas?: number
      
        Activo?: boolean

    }
    export interface IQuitaPorcentajes {
              
        QuitaID: number
      
        PagosNombre?: string
      
        PorcientoQuita?: number
      
        Activo?: boolean

    }
    export interface ISolicitudDocumentosiCRS_VW {
              
        SolicitudRCID?: number
      
        DocumentoID?: number
      
        DistribuidorID?: number
      
        Ruta?: string
      
        Autorizado?: boolean
      
        TipoDocumentoID?: number
      
        ProductoID?: number
      
        Opcional?: boolean
      
        NombreDocumento?: string
      
        Descripcion?: string

    }
    export interface ISolicitudReestructurasConvenios {
              
        SolicitudRCID: number
      
        SaldoActual: number
      
        SaldoAtrasado: number
      
        QuitaID: number
      
        MontoIntencion: number
      
        PlazoID: number
      
        Motivo: string
      
        DistribuidorID: number
      
        FechaRegistro: string
      
        UsuarioID: number
      
        PersonaRegistraID: number
      
        ProductoID: number
      
        Accion: number
      
        TipoReestructura?: string
      
        Estatus: string
      
        Completado?: boolean
      
        TipoHerramientaID: number
      
        FechaAceptacion?: string
      
        FechaCancelacion?: string
      
        ComentariosCancelacion?: string
      
        ObservacionesAdicionales?: string
      
        DNI?: string
      
        PersonaAceptaID?: number
      
        PersonaCancelaID?: number
      
        FechaValidacion?: string
      
        PersonaValidaID?: number
      
        FechaRechazo?: string
      
        PersonaRechazaID?: number
      
        FechaReValidacion?: string
      
        PersonaRevalidaID?: number
      
        ValidoAnalista?: boolean
      
        AnalistaValidaID?: number
      
        FechaValidaAnalista?: string

    }
    export interface ISolicitudReestructurasConvenios_VW {
              
        SolicitudRCID: number
      
        Estatus: string
      
        Producto: string
      
        ProductoID: number
      
        SucursalID: number
      
        Sucursal_Nombre: string
      
        DistribuidorID: number
      
        PersonaNombre?: string
      
        Accion: number
      
        TipoReestructura?: string
      
        Motivo: string
      
        Quincenas?: number
      
        SaldoActual: number
      
        SaldoAtrasado: number
      
        PorcientoQuita?: number
      
        Nombre: string
      
        FechaRegistro: string
      
        Completado?: boolean
      
        AnalistaID: number
      
        PersonaID: number
      
        FechaAceptacion?: string
      
        PlazoID: number
      
        QuitaID: number
      
        MontoIntencion: number
      
        ValidoAnalista?: boolean
      
        Descripcion: string

    }
    export interface ISolicitudReestructurasConveniosDP_VW {
              
        SolicitudRCID: number
      
        Estatus: string
      
        Producto: string
      
        ProductoID: number
      
        SucursalID: number
      
        Sucursal_Nombre: string
      
        DistribuidorID: number
      
        PersonaNombre?: string
      
        Accion: number
      
        TipoReestructura?: string
      
        Motivo: string
      
        Quincenas?: number
      
        SaldoActual: number
      
        SaldoAtrasado: number
      
        PorcientoQuita?: number
      
        Nombre: string
      
        FechaRegistro: string
      
        Completado?: boolean
      
        FechaAceptacion?: string
      
        PlazoID: number
      
        QuitaID: number
      
        MontoIntencion: number
      
        Descripcion: string

    }
    export interface ITipoAnalista {
              
        TipoAnalistaID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ITipoDocumento {
              
        TipoDocumentoID: number
      
        NombreDocumento: string
      
        Descripcion: string
      
        Activo: boolean

    }
    export interface ITipoDocumentoDetalle {
              
        TipoDocumentoDetalleID: number
      
        TipoDocumentoID: number
      
        ProductoID: number
      
        Opcional: boolean
      
        Activo: boolean

    }
    export interface ITiposHerramientaRescate {
              
        TipoHerramientaID: number
      
        NombreTipoHerramienta?: string
      
        Activo: boolean
      
        Clave?: string

    }
}