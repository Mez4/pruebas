export namespace DBConfia_Compras {
        
    export interface IAprobacion_VW {
              
        AprobadoID: number
      
        SolicitudID?: number
      
        SolicitanteID?: number
      
        NombreSolicita?: string
      
        ApruebaID?: number
      
        NombreAprueba?: string
      
        FechaSolicitud: string
      
        FechaAprobado?: string
      
        EstatusID: number
      
        EstatusDes?: string
      
        Descripcion: string
      
        ProductoID?: number
      
        EmpresaId?: number

    }
    export interface IAprobacionDetalle {
              
        AprobadoDetalleID: number
      
        AprobadoID?: number
      
        SolicitudDetalleID?: number
      
        ProductoUniformeID: number
      
        PiezasSolicitadas: number
      
        PiezasAprobadas: number

    }
    export interface IAprobacionDetalle_VW {
              
        AprobadoDetalleID: number
      
        AprobadoID?: number
      
        SolicitudDetalleID?: number
      
        ProductoUniformeID: number
      
        PiezasSolicitadas?: number
      
        PiezasAprobadas: number
      
        ProductoUniformeDesc?: string

    }
    export interface ICatalogoEstatus {
              
        EstatusID: number
      
        Estatus: string
      
        Descripcion: string

    }
    export interface ICatalogoEstatusvw {
              
        EstatusID: number
      
        Estatus: string
      
        Descripcion: string

    }
    export interface IColor {
              
        ColorID: number
      
        Colores?: string

    }
    export interface Idocto_estatus {
              
        id_estatus?: number
      
        clave?: string
      
        estatus?: string

    }
    export interface Idoctos_uni {
              
        docto_uni_id: number
      
        tipo_docto?: string
      
        estatus?: string
      
        descripcion?: string
      
        usuario_id_registra?: number
      
        fecha_registro?: string
      
        usuario_id_aprobacion?: number
      
        fecha_aprobacion?: string
      
        usuario_id_cancelacion?: number
      
        fecha_cancelacion?: string
      
        usuario_id_ult_modificacion?: number
      
        fecha_ult_modificacion?: string

    }
    export interface Idoctos_uni_det {
              
        docto_uni_id_det: number
      
        docto_uni_id?: number
      
        tipo_id?: number
      
        corte_id?: number
      
        talla_id?: number
      
        color_id?: number
      
        cantidad_solicitada?: number
      
        cantidad_aprobada?: number
      
        cantidad_recepcion?: number

    }
    export interface Idoctos_uniformes_detallevw {
              
        docto_uni_id_det: number
      
        docto_uni_id?: number
      
        tipo_id?: number
      
        corte_id?: number
      
        talla_id?: number
      
        color_id?: number
      
        cantidad_solicitada?: number
      
        cantidad_aprobada?: number
      
        cantidad_recepcion?: number

    }
    export interface Idoctos_uniformesvw {
              
        docto_uni_id: number
      
        usuario_id_registra?: number
      
        NombreRegistra?: string
      
        fecha_registro?: string
      
        usuario_id_aprobacion?: number
      
        NombreAprobacion?: string
      
        fecha_aprobacion?: string
      
        usuario_id_cancelacion?: number
      
        NombreCancela?: string
      
        fecha_cancelacion?: string
      
        estatus: string
      
        tipo_docto: string
      
        descripcion?: string

    }
    export interface IDocumentosUniformes {
              
        DocumentoID: number
      
        SurtidoID?: number
      
        Ruta: string
      
        Autorizado: boolean
      
        Firmado?: boolean
      
        RecepcionID?: number

    }
    export interface IInventarioUniformes {
              
        InventarioID: number
      
        PersonaID: number
      
        ProductoUniformeID: number
      
        NumeroPiezas: number
      
        FechaCaptura: string
      
        TipoMov: string

    }
    export interface IInventarioUniformes_VW {
              
        InventarioID: number
      
        ProductoUniformeID?: number
      
        ProductoUniformeDesc?: string
      
        TipoMov: string
      
        NumeroPiezas: number
      
        NombreCompleto?: string
      
        FechaCaptura: string

    }
    export interface IOrden {
              
        OrdenID: number
      
        SolicitudID?: number
      
        ApruebaID?: number
      
        AutorizaID?: number
      
        FechaAprobado?: string
      
        FechaAutorizado?: string
      
        EstatusID?: number
      
        AprobadoID?: number
      
        ProductoID?: number
      
        Pendientes: boolean

    }
    export interface IOrden_VW {
              
        OrdenID: number
      
        SolicitudID?: number
      
        SolicitanteID?: number
      
        NombreSolicita?: string
      
        ApruebaID?: number
      
        NombreAprueba?: string
      
        AutorizaID?: number
      
        NombreAutoriza?: string
      
        FechaAprobado?: string
      
        FechaAutorizado?: string
      
        EstatusID?: number
      
        EstatusDes?: string
      
        Pendientes: boolean
      
        AprobadoID?: number
      
        ProductoID?: number
      
        EmpresaId?: number

    }
    export interface IOrdenDetalle {
              
        OrdenDetalleID: number
      
        OrdenID?: number
      
        SolicitudDetalleID?: number
      
        AprobadoDetalleID?: number
      
        ProductoUniformeID: number
      
        PiezasAprobadas: number
      
        PiezasAutorizadas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string

    }
    export interface IOrdenDetalle_VW {
              
        OrdenDetalleID: number
      
        OrdenID?: number
      
        SolicitudDetalleID: number
      
        AprobadoDetalleID: number
      
        ProductoUniformeDesc?: string
      
        PiezasSolicitadas: number
      
        PiezasAprobadas: number
      
        PiezasAutorizadas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string

    }
    export interface IOrdenesUniformes {
              
        OrdenID: number
      
        SolicitudUniformeID?: number
      
        FechaSolicitud?: string
      
        EstatusID?: number
      
        FechaAutorizado?: string
      
        AutorizadoID?: number
      
        FechaAprobado?: string
      
        SolicitanteID?: number
      
        AprobadoID?: number
      
        EstatusDes?: string
      
        Cancelada?: boolean

    }
    export interface IOrdenesUniformesDetalle {
              
        OrdenDetalleID: number
      
        SolicitudUniformeDetalleID?: number
      
        OrdenID?: number
      
        PiezasSolicitadas?: number
      
        PiezasAprobadas?: number
      
        PiezasAutorizadas?: number
      
        PiezasPendientes: number
      
        Cancelada: boolean
      
        FechaCompromiso?: string
      
        observaciones?: string

    }
    export interface IProducto {
              
        ProductoUniformeID: number
      
        ProductoUniformeDesc?: string
      
        Clave: string
      
        Existencia: number
      
        Activo: boolean

    }
    export interface IRecepcion {
              
        RecepcionID: number
      
        RecibeID?: number
      
        SolicitudID?: number
      
        SurteID?: number
      
        CancelaID?: number
      
        DevuelveID?: number
      
        FechaSurtido?: string
      
        FechaRecepcion?: string
      
        FechaCancelacion?: string
      
        FechaDevolucion?: string
      
        EstatusID: number
      
        Descripcion: string
      
        Cancelada: boolean
      
        RecepcionParcial: boolean
      
        Devolucion: boolean
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        SurtidoID?: number
      
        DevolucionID?: number
      
        ComprobanteDoc?: string
      
        DocumentoID?: number
      
        ComprobanteFirma?: string
      
        FirmaDocID?: number
      
        ProductoID?: number
      
        Pendientes: boolean

    }
    export interface IRecepcion_VW {
              
        RecepcionID: number
      
        SolicitudID?: number
      
        SurteID?: number
      
        NombreSurte?: string
      
        RecibeID?: number
      
        NombreRecibe?: string
      
        CancelaID?: number
      
        NombreCancela?: string
      
        DevuelveID?: number
      
        NombreDevolucion?: string
      
        FechaSurtido?: string
      
        FechaRecepcion?: string
      
        FechaCancelacion?: string
      
        FechaDevolucion?: string
      
        EstatusID: number
      
        EstatusDes?: string
      
        Descripcion: string
      
        Cancelada: boolean
      
        RecepcionParcial: boolean
      
        Devolucion: boolean
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        SurtidoID?: number
      
        DevolucionID?: number
      
        ComprobanteDoc?: string
      
        DocumentoID?: number
      
        ComprobanteFirma?: string
      
        FirmaDocID?: number
      
        ProductoID?: number
      
        EmpresaId?: number
      
        Pendientes: boolean

    }
    export interface IRecepcionDetalle {
              
        RecepcionDetalleID: number
      
        RecepcionID?: number
      
        SolicitudDetalleID?: number
      
        SurtidoDetalleID?: number
      
        ProductoUniformeID: number
      
        PiezasSolicitadas: number
      
        PiezasSurtidas: number
      
        PiezasRecepcionadas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string
      
        PiezasPendientesRecepcion?: number

    }
    export interface IRecepcionDetalle_VW {
              
        RecepcionDetalleID: number
      
        RecepcionID?: number
      
        SolicitudDetalleID?: number
      
        SurtidoDetalleID?: number
      
        ProductoUniformeID: number
      
        ProductoUniformeDesc?: string
      
        PiezasSolicitadas: number
      
        PiezasSurtidas: number
      
        PiezasRecepcionadas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string
      
        Existencia: number

    }
    export interface ISolicitud {
              
        SolicitudID: number
      
        SolicitanteID: number
      
        RecepcionaID?: number
      
        CancelaID?: number
      
        FechaSolicitud: string
      
        FechaRecepcion?: string
      
        FechaCancelacion?: string
      
        EstatusID: number
      
        Piezas: number
      
        Descripcion: string
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        RecepcionID?: number
      
        RecepcionParcialID?: number
      
        DevolucionID?: number
      
        ProductoID?: number
      
        Recepcionado: boolean
      
        Aprobado: boolean

    }
    export interface ISolicitud_VW {
              
        SolicitudID: number
      
        SolicitanteID: number
      
        NombreSolicita?: string
      
        RecepcionaID?: number
      
        NombreRecepciona?: string
      
        CancelaID?: number
      
        NombreCancela?: string
      
        FechaSolicitud: string
      
        FechaRecepcion?: string
      
        FechaCancelacion?: string
      
        EstatusID: number
      
        EstatusDes?: string
      
        Piezas: number
      
        Descripcion: string
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        RecepcionID?: number
      
        Recepcionado: boolean
      
        Aprobado: boolean
      
        RecepcionParcialID?: number
      
        DevolucionID?: number
      
        ProductoID?: number
      
        EmpresaId?: number

    }
    export interface ISolicitudDetalle {
              
        SolicitudDetalleID: number
      
        SolicitudID?: number
      
        ProductoUniformeID: number
      
        PiezasSolicitadas: number
      
        PiezasRecepcionadas: number
      
        PiezasAprobadas: number

    }
    export interface ISolicitudDetalle_VW {
              
        SolicitudDetalleID: number
      
        SolicitudID?: number
      
        ProductoUniformeID: number
      
        ProductoUniformeDesc?: string
      
        PiezasSolicitadas: number
      
        PiezasAprobadas: number
      
        PiezasRecepcionadas: number

    }
    export interface ISolicitudOrdenCompra_VW {
              
        OrdenID: number
      
        SolicitudUniformeID?: number
      
        SolicitanteID?: number
      
        NombreSolicita?: string
      
        AprobadoID?: number
      
        NombreAprueba?: string
      
        AutorizadoID?: number
      
        NombreAutoriza?: string
      
        FechaSolicitud?: string
      
        FechaAprobado?: string
      
        FechaAutorizado?: string
      
        EstatusID?: number
      
        EstatusDes?: string

    }
    export interface ISolicitudOrdenCompraDetalle_VW {
              
        OrdenDetalleID: number
      
        OrdenID?: number
      
        SolicitudUniformeDetalleID: number
      
        PiezasSolicitadas?: number
      
        PiezasAprobadas: number
      
        PiezasAutorizadas?: number

    }
    export interface ISolicitudUniformes {
              
        SolicitudUniformeID: number
      
        SolicitanteID: number
      
        AutorizadoID?: number
      
        CanceladoID?: number
      
        FechaSolicitud: string
      
        FechaAutorizado?: string
      
        Estatus: number
      
        Descripcion: string
      
        Piezas: number
      
        FechaCancelacion?: string
      
        AprobadoID?: number
      
        SurtidoID?: number
      
        FechaAprobado?: string
      
        FechaSurtido?: string
      
        Comprobante?: string
      
        EstatusDes?: string
      
        ReOrden: boolean
      
        Cancelada: boolean
      
        OrdenID?: number
      
        DocumentoID?: number
      
        FirmaDocID?: number

    }
    export interface ISolicitudUniformesDetalle {
              
        SolicitudUniformeDetalleID: number
      
        SolicitudUniformeID?: number
      
        ColorID: number
      
        CorteID: number
      
        TallaID: number
      
        TipoID: number
      
        Piezas: number
      
        PiezasAprobadas: number
      
        PiezasAutorizadas: number
      
        PiezasPendientes: number
      
        observaciones?: string
      
        FechaCompromiso?: string

    }
    export interface ISurtido {
              
        SurtidoID: number
      
        SolicitudID?: number
      
        AutorizaID?: number
      
        SurteID?: number
      
        CancelaID?: number
      
        FechaAutorizado?: string
      
        FechaSurtido?: string
      
        FechaCancelacion?: string
      
        EstatusID: number
      
        Descripcion: string
      
        Cancelada: boolean
      
        ReOrden: boolean
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        ComprobanteDoc?: string
      
        DocumentoID?: number
      
        ComprobanteFirma?: string
      
        FirmaDocID?: number
      
        ProductoID?: number
      
        Pendientes: boolean

    }
    export interface ISurtido_VW {
              
        SurtidoID: number
      
        SolicitudID?: number
      
        AutorizaID?: number
      
        NombreAutoriza?: string
      
        SurteID?: number
      
        NombreSurte?: string
      
        CancelaID?: number
      
        NombreCancela?: string
      
        FechaAutorizado?: string
      
        FechaSurtido?: string
      
        FechaCancelacion?: string
      
        EstatusID: number
      
        EstatusDes?: string
      
        Descripcion: string
      
        Cancelada: boolean
      
        ReOrden: boolean
      
        OrdenID?: number
      
        ReOrdenID?: number
      
        ComprobanteDoc?: string
      
        DocumentoID?: number
      
        ComprobanteFirma?: string
      
        FirmaDocID?: number
      
        ProductoID?: number
      
        EmpresaId?: number
      
        Pendientes: boolean

    }
    export interface ISurtidoDetalle {
              
        SurtidoDetalleID: number
      
        SurtidoID?: number
      
        SolicitudDetalleID?: number
      
        OrdenDetalleID?: number
      
        ProductoUniformeID: number
      
        PiezasAutorizadas: number
      
        PiezasSurtidas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string

    }
    export interface ISurtidoDetalle_VW {
              
        SurtidoDetalleID: number
      
        SurtidoID?: number
      
        SolicitudDetalleID?: number
      
        OrdenDetalleID?: number
      
        ProductoUniformeID: number
      
        ProductoUniformeDesc?: string
      
        PiezasAutorizadas: number
      
        PiezasSurtidas: number
      
        PiezasPendientes: number
      
        FechaCompromiso?: string
      
        Observaciones?: string

    }
    export interface ITalla {
              
        TallaID: number
      
        Tallas?: string

    }
    export interface ITipo {
              
        TipoID: number
      
        Tipos?: string

    }
    export interface ITipoDocto {
              
        id_tipodocto?: number
      
        clave?: string
      
        documento?: string

    }
}