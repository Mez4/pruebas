export namespace DBConfia_Cortes {
        
    export interface IFechaCorte_VW {
              
        fecha: string
      
        fechaCorte?: string
      
        SucursalID: number

    }
    export interface IFechaCorteHistorico_VW {
              
        fecha: string
      
        fechaCorte?: string
      
        SucursalID: number

    }
    export interface IRelacionCortes {
              
        fechaCorte: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        DistribuidorNivelID?: number
      
        creditosEnRelacion?: number
      
        LineaCredito?: number
      
        LineaCreditoDisponible?: number
      
        FechaVencimiento?: string
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        SaldoActual: number
      
        DistribuidoresEstatusID?: string
      
        TipoPago?: string
      
        DiasAtraso?: number
      
        DiasAtrasoHistorico?: number
      
        SaldoAtrasadoHistorico?: number
      
        DistribuidorNivelIDOrigen?: number
      
        SaldoComisionPlazo?: number

    }
    export interface IRelacionCortes_VW {
              
        fechaCorte?: string
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorNivelID?: number
      
        creditosEnRelacion?: number
      
        LineaCredito?: number
      
        LineaCreditoDisponible?: number
      
        FechaVencimiento?: string
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        SaldoActual: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivel: string
      
        TelefonoMovil: string
      
        ConvenioID: number
      
        convenio: string
      
        refSoriana?: string
      
        refBancomer?: string
      
        ContratoCIE?: string
      
        refOxxo?: string
      
        refSPEI?: string
      
        DistribuidorNivelID2?: number
      
        DistAntNumero2?: number
      
        DistAntNumero?: number

    }
    export interface IRelacionCortesDetalle {
              
        fechaCorte: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        ProductoID: number
      
        ComisionesId?: number
      
        DistribuidorNivelID?: number
      
        ContratoID: number
      
        CreditoID: number
      
        NoPago: number
      
        TotalPagos?: number
      
        creditoClasificacionId?: number
      
        saldoCredito?: number
      
        FechaVencimiento?: string
      
        plazoVencido?: number
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        CortePart?: number
      
        SerieId?: number
      
        FolioVale?: number
      
        FechaCanje?: string
      
        ClienteID?: number
      
        Cliente?: string
      
        DiasAtrasoHistorico?: number
      
        DiasAtraso?: number
      
        SaldoAtrasadoHistorico?: number
      
        DistribuidorNivelIDOrigen?: number
      
        SaldoComisionPlazo?: number

    }
    export interface IRelacionCortesDetalle_VW {
              
        fechaCorte?: string
      
        SucursalID: number
      
        ProductoID: number
      
        ComisionesId?: number
      
        DistribuidorNivelID?: number
      
        ContratoID: number
      
        CreditoID: number
      
        NoPago?: number
      
        creditoClasificacionId?: number
      
        saldoCredito?: number
      
        FechaVencimiento?: string
      
        plazoVencido?: number
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        DistribuidorID: number
      
        ImporteTotal?: number
      
        Atraso?: number
      
        PagoPlazo?: string
      
        ValeCanje?: number
      
        SldDspPago?: number
      
        Nombre: string
      
        FechaCanje?: string
      
        ClienteID?: number
      
        Cliente?: string
      
        Producto: string

    }
    export interface IRelacionCortesDetalleHistorico {
              
        fechaCorte: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        ProductoID: number
      
        ComisionesId?: number
      
        DistribuidorNivelID?: number
      
        ContratoID: number
      
        CreditoID: number
      
        NoPago: number
      
        TotalPagos?: number
      
        creditoClasificacionId?: number
      
        saldoCredito?: number
      
        FechaVencimiento?: string
      
        plazoVencido?: number
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        CortePart?: number
      
        SerieId?: number
      
        FolioVale?: number
      
        FechaCanje?: string
      
        ClienteID?: number
      
        Cliente?: string
      
        DiasAtraso?: number
      
        DiasAtrasoHistorico?: number
      
        SaldoComisionPlazo?: number

    }
    export interface IRelacionCortesDetalleHistorico_VW {
              
        fechaCorte?: string
      
        SucursalID: number
      
        ProductoID: number
      
        ComisionesId?: number
      
        DistribuidorNivelID?: number
      
        ContratoID: number
      
        CreditoID: number
      
        NoPago?: number
      
        creditoClasificacionId?: number
      
        saldoCredito?: number
      
        FechaVencimiento?: string
      
        plazoVencido?: number
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        DistribuidorID: number
      
        ImporteTotal?: number
      
        Atraso?: number
      
        PagoPlazo?: string
      
        ValeCanje?: number
      
        SldDspPago?: number
      
        Nombre: string
      
        FechaCanje?: string
      
        ClienteID?: number
      
        Cliente?: string
      
        Producto: string

    }
    export interface IRelacionCortesHistorico {
              
        fechaCorte: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        DistribuidorNivelID?: number
      
        creditosEnRelacion?: number
      
        LineaCredito?: number
      
        LineaCreditoDisponible?: number
      
        FechaVencimiento?: string
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        SaldoActual: number
      
        DistribuidoresEstatusID?: string
      
        TipoPago?: string
      
        DiasAtraso?: number
      
        DiasAtrasoHistorico?: number
      
        DistribuidorNivelIDOrigen?: number
      
        SaldoComisionPlazo?: number

    }
    export interface IRelacionCortesHistorico_VW {
              
        fechaCorte?: string
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorNivelID?: number
      
        creditosEnRelacion?: number
      
        LineaCredito?: number
      
        LineaCreditoDisponible?: number
      
        FechaVencimiento?: string
      
        saldoVencidoTotal?: number
      
        saldoAtrasado?: number
      
        importePlazo?: number
      
        saldoPlazo?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        SeguroPlazo?: number
      
        ComisionPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number
      
        AbonosPlazo?: number
      
        baseComision?: number
      
        SaldoActual: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivel: string
      
        TelefonoMovil: string
      
        ConvenioID: number
      
        convenio: string
      
        refSoriana?: string
      
        refBancomer?: string
      
        ContratoCIE?: string
      
        refOxxo?: string
      
        refSPEI?: string
      
        DistribuidorNivelID2?: number
      
        DistAntNumero2?: number
      
        DistAntNumero?: number

    }
    export interface IRelacionCortesLineas {
              
        fechaCorte: string
      
        fechaVencimiento?: string
      
        ContratoID: number
      
        LineaAdicionalTipoID: number
      
        LineaCredito?: number
      
        LineaCreditoDisponible?: number
      
        NoCreditosActivos?: number
      
        SaldoActual?: number
      
        CapitalColocado?: number
      
        DistribuidorID: number

    }
    export interface IRelacionCortesTablaDias {
              
        fechaCorte: string
      
        ProductoID: number
      
        ComisionesID: number
      
        DistribuidorNivelID: number
      
        fechaVencimiento: string
      
        Dias: number
      
        DiasMin?: number
      
        DiasMax?: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        PorcMonedero: number
      
        PorcMonederoReal: number
      
        Renglon: number
      
        FechaPago?: string
      
        DistribuidorNivelIDOrigen?: number

    }
    export interface IRelacionCortesTablaDias_VW {
              
        fechaCorte?: string
      
        fecha: string
      
        ProductoID: number
      
        ComisionesID: number
      
        DistribuidorNivelID: number
      
        fechaVencimiento: string
      
        Dias: number
      
        DiasMin?: number
      
        DiasMax?: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        PorcMonedero: number
      
        PorcMonederoReal: number
      
        Renglon: number
      
        FechaPago?: string
      
        SucursalID: number

    }
    export interface IRelacionCortesTablaDiasHistorico {
              
        fechaCorte: string
      
        ProductoID: number
      
        ComisionesID: number
      
        DistribuidorNivelID: number
      
        fechaVencimiento: string
      
        Dias: number
      
        DiasMin?: number
      
        DiasMax?: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        PorcMonedero: number
      
        PorcMonederoReal: number
      
        Renglon: number
      
        FechaPago?: string
      
        DistribuidorNivelIDOrigen?: number

    }
    export interface IRelacionCortesTablaDiasHistorico_VW {
              
        fechaCorte?: string
      
        fecha: string
      
        ProductoID: number
      
        ComisionesID: number
      
        DistribuidorNivelID: number
      
        fechaVencimiento: string
      
        Dias: number
      
        DiasMin?: number
      
        DiasMax?: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        PorcMonedero: number
      
        PorcMonederoReal: number
      
        Renglon: number
      
        FechaPago?: string
      
        SucursalID: number

    }
    export interface IVW_Ultima_Relacion_Sel {
              
        fechaCorte?: string
      
        DistribuidorID: number
      
        SucursalID: number

    }
}