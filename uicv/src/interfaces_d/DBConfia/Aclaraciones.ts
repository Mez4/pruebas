export namespace DBConfia_Aclaraciones {
        
    export interface IAclaracion_VW {
              
        AclaracionID: number
      
        FechaCaptura: string
      
        SucursalID?: number
      
        NombreSucursal?: string
      
        DistribuidorID: number
      
        NombreDistribuidor?: string
      
        CreditoID?: number
      
        DescripcionAclaracion?: string
      
        EstatusID?: number
      
        ClaveEstatus?: string
      
        DescripcionEstatus?: string
      
        NotasTesoreria?: string
      
        Observaciones?: string
      
        MesaAclaracionID?: number
      
        NombreMesaAclaracion?: string
      
        BonificacionID?: number
      
        PorcentajeBonificacion?: number
      
        SolicitaID?: number
      
        NombreSolicita?: string
      
        FechaAsignacion?: string
      
        AnalistaID?: number
      
        NombreAnalista: string
      
        GerenteID?: number
      
        NombreGerente?: string
      
        Asiganada?: boolean
      
        ProductoID?: number
      
        Producto?: string
      
        ClaveSolicitud?: string
      
        DescTipoSolicitud?: string

    }
    export interface IAclaraciones {
              
        AclaracionID: number
      
        FechaCaptura: string
      
        SucursalID: number
      
        DistribuidorID: number
      
        CreditoID?: number
      
        DescripcionAclaracion?: string
      
        EstatusID?: number
      
        NotasTesoreria?: string
      
        Observaciones?: string
      
        DocumentoID?: number
      
        MesaAclaracionID?: number
      
        BonificacionID?: number
      
        SolicitaID?: number
      
        FechaAsignacion?: string
      
        AnalistaID?: number
      
        GerenteID?: number
      
        Asiganada?: boolean
      
        ProductoID?: number
      
        TipoSolicitudID?: number

    }
    export interface IAnalista_VW {
              
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo?: boolean

    }
    export interface IAnalistas {
              
        AnalistaID: number
      
        FechaRegistro: string
      
        Activo?: boolean

    }
    export interface IAnalistas_VW {
              
        AnalistaID: number
      
        NombreCompleto?: string
      
        FechaRegistro: string
      
        Activo?: boolean

    }
    export interface IAnalistasConSucursal_VW {
              
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string

    }
    export interface IAnalistasSinSucursal_VW {
              
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string

    }
    export interface IAnalistasSucursales {
              
        AnalistaSucursalID: number
      
        AnalistaID: number
      
        SucursalID: number
      
        Activo: boolean

    }
    export interface IAnalistaSucursal_VW {
              
        AnalistaSucursalID: number
      
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        SucursalID?: number
      
        Nombre?: string

    }
    export interface IBitacora {
              
        MovBitacoraID: number
      
        AclaracionID: number
      
        Modifico: string
      
        Fecha: string
      
        TipoMovimientoID: string

    }
    export interface IBitacora_VW {
              
        MovBitacoraID: number
      
        AclaracionID: number
      
        Modifico: string
      
        TipoMovimientoID?: number
      
        DescripcionMov?: string
      
        Fecha: string

    }
    export interface IBonificaciones {
              
        BonificacionID: number
      
        PorcentajeBonificacion: number

    }
    export interface IConceptos {
              
        ConceptoID: number
      
        Clave: string
      
        DescripcionConcepto: string

    }
    export interface IDocumentosAclaracion {
              
        DocumentoID: number
      
        AclaracionID: number
      
        Ruta?: string
      
        Firmado?: boolean

    }
    export interface IEncargados {
              
        EncargadoID: number
      
        FechaRegistro: string
      
        Activo?: boolean

    }
    export interface IEncargados_VW {
              
        EncargadoID: number
      
        NombreCompleto?: string
      
        FechaRegistro: string
      
        Activo?: boolean

    }
    export interface IEstatus {
              
        EstatusID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ILogMensajes {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        AnalistaID: number
      
        Leido: boolean
      
        EnviadoDesdePantalla: boolean
      
        AclaracionID?: number

    }
    export interface ILogMensajes_VW {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        Leido?: boolean
      
        EnviadoDesdePantalla: boolean
      
        AclaracionID?: number
      
        DescripcionAclaracion?: string

    }
    export interface IMesaAclaracion {
              
        MesaAclaracionID: number
      
        NombreMesaAclaracion: string
      
        Clave: string
      
        Activo?: boolean

    }
    export interface IMesaAclaracion_VW {
              
        MesaAclaracionID: number
      
        NombreMesaAclaracion: string
      
        Clave: string
      
        Activo?: boolean

    }
    export interface IMesasConSucursales_VW {
              
        MesaAclaracionID: number
      
        NombreMesaAclaracion: string
      
        Clave: string
      
        Activo?: boolean

    }
    export interface IMesasSinSucursales_VW {
              
        MesaAclaracionID: number
      
        NombreMesaAclaracion: string
      
        Clave: string
      
        Activo?: boolean

    }
    export interface IProductoMesaAclaracion {
              
        ProductoMesaAclaracionID: number
      
        MesaAclaracionID: number
      
        ProductoID: number
      
        Activo: boolean

    }
    export interface IProductoMesaAclaracion_VW {
              
        ProductoMesaAclaracionID: number
      
        MesaAclaracionID?: number
      
        NombreMesaAclaracion?: string
      
        ProductoID?: number
      
        Producto?: string
      
        Activo: boolean

    }
    export interface IProductosDistribuidoraPrincipal_VW {
              
        ProductoID: number
      
        Producto: string
      
        empresaId?: number
      
        empresaNombre?: string
      
        SucursalID2?: number
      
        NombreSucursal?: string
      
        Principal?: boolean
      
        DistribuidorID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        GrupoID?: number
      
        SucursalID?: number
      
        CoordinadorID?: number

    }
    export interface ISucursalesAnalistas_VW {
              
        Estatus: number
      
        AnalistaID: number
      
        SucursalID?: number
      
        Nombre?: string

    }
    export interface ISucursalesSinAnalista_VW {
              
        SucursalID: number
      
        Nombre: string
      
        distribuidorIdMin: number
      
        distribuidorIdMax: number
      
        importeLimiteCreditoDefault: number
      
        tabuladorTipoID: number
      
        ZonaID: number
      
        ZonaNombre: string
      
        SucursalFisica: string
      
        SucursalFisicaID: number
      
        tabuladorTipoDesc: string
      
        PersonaResponsableID: number
      
        NombreCompleto: string

    }
    export interface ISucursalesSinMesas_VW {
              
        SucursalID: number
      
        Nombre: string
      
        distribuidorIdMin: number
      
        distribuidorIdMax: number
      
        importeLimiteCreditoDefault: number
      
        tabuladorTipoID: number
      
        ZonaID: number
      
        SucursalFisicaID: number
      
        DiasDeEntregaAprox?: number
      
        PersonaResponsableID?: number
      
        CreacionFecha?: string

    }
    export interface ISucursalMesas {
              
        MesaSucursalID: number
      
        MesaAclaracionID: number
      
        SucursalID: number
      
        Activa: boolean
      
        FechaCaptura: string

    }
    export interface ISucursalMesas_VW {
              
        MesaSucursalID: number
      
        MesaAclaracionID?: number
      
        NombreMesaAclaracion?: string
      
        SucursalID?: number
      
        NombreSucursal?: string
      
        Activa: boolean
      
        Eliminado?: boolean
      
        Nueva?: boolean
      
        Existe?: boolean

    }
    export interface ITipoMovimientos {
              
        TipoMovimientoID: number
      
        ClaveMovimiento: string
      
        DescripcionMov: string

    }
    export interface ITipoSolicitud {
              
        TipoSolicitudID: number
      
        ClaveSolicitud: string
      
        Descripcion: string

    }
}