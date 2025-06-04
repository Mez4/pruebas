export namespace DBConfia_Indicadores {
        
    export interface IHistoricos_Socias_Detalle {
              
        Fecha: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        ProductoID: number
      
        Limite?: number
      
        Disponible?: number
      
        Saldo?: number
      
        Vencido?: number
      
        Cobranza?: number
      
        Comision?: number
      
        Pendiente?: number
      
        Reestructura?: number
      
        Convenio?: number
      
        Colocacion?: number

    }
    export interface IHistoricos_Socias_Detalle_VW {
              
        Fecha: string
      
        SucursalID?: number
      
        SucursalNombre?: string
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        DistAntSistema?: string
      
        DistAntNumero?: number
      
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        GrupoID?: number
      
        DiasAtraso?: number
      
        FechaUltimoVencimiento?: string
      
        FechaUltimoLiquidacion?: string
      
        TipoPago?: string
      
        TipoPagoAnt1?: string
      
        TipoPagoAnt2?: string
      
        TipoPagoAnt3?: string
      
        TipoPagoAnt4?: string
      
        DiasAtrasoCierre?: number
      
        IncrementoSugerido?: number
      
        IncrementoMes?: boolean
      
        IncrementoAutorizado?: number
      
        EstadoCoordinadorId?: string
      
        CoordinadorID?: number
      
        CoordinadorNombre?: string
      
        DistribuidorNombre?: string
      
        ProductoID?: number
      
        ProductoNombre?: string
      
        EmpresaId?: number
      
        EmpresaNombre?: string
      
        Limite?: number
      
        Saldo?: number
      
        Vencido?: number
      
        Cobranza?: number
      
        Comision?: number
      
        Pendiente?: number
      
        Reestructura?: number
      
        Convenio?: number
      
        Colocacion?: number
      
        Disponible?: number

    }
    export interface IHistoricos_Socias_DetalleGroup_VW {
              
        Fecha: string
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        SucursalID?: number
      
        SucursalNombre?: string
      
        GrupoID?: number
      
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNombre?: string
      
        TipoPago?: string
      
        TipoPagoAnt1?: string
      
        TipoPagoAnt2?: string
      
        TipoPagoAnt3?: string
      
        TipoPagoAnt4?: string
      
        DistAntSistema?: string
      
        DistAntNumero?: number
      
        CoordinadorID?: number
      
        CoordinadorNombre?: string
      
        EstadoCoordinadorId?: string
      
        IncrementoSugerido?: number
      
        IncrementoMes?: boolean
      
        IncrementoAutorizado?: number
      
        Vencido?: number
      
        Pendiente?: number
      
        Cobranza?: number
      
        DiasAtraso?: number
      
        DiasAtrasoCierre?: number
      
        FechaUltimoVencimiento?: string
      
        FechaUltimoLiquidacion?: string
      
        Limite?: number
      
        Saldo?: number
      
        Comision?: number
      
        Reestructura?: number
      
        Convenio?: number
      
        Colocacion?: number
      
        Disponible: number
      
        OrdenTipoPago: number
      
        OrdenTipoPagoAnt: number
      
        ColocacionAnterior: number
      
        PColocacion?: number
      
        PDisponible: number
      
        Bono?: number

    }
    export interface IHistoricos_Socias_VW {
              
        Fecha: string
      
        SucursalID?: number
      
        SucursalNombre?: string
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        DistAntSistema?: string
      
        DistAntNumero?: number
      
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        GrupoID?: number
      
        DiasAtraso?: number
      
        FechaUltimoVencimiento?: string
      
        FechaUltimoLiquidacion?: string
      
        TipoPago?: string
      
        TipoPagoAnt1?: string
      
        TipoPagoAnt2?: string
      
        TipoPagoAnt3?: string
      
        TipoPagoAnt4?: string
      
        DiasAtrasoCierre?: number
      
        IncrementoSugerido?: number
      
        IncrementoMes?: boolean
      
        IncrementoAutorizado?: number
      
        EstadoCoordinadorId?: string
      
        CoordinadorID?: number
      
        CoordinadorNombre?: string

    }
    export interface IVW_Base_DVs {
              
        Fecha: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        GrupoID: number
      
        CoordinadorID: number
      
        DiasAtraso?: number
      
        DiasAtrasoCierre?: number
      
        TipoPago?: string
      
        TipoPago1?: string
      
        DistribuidoresEstatusID?: string
      
        DistAntSistema?: string
      
        DistAntNumero?: number
      
        DistAntSistema2?: string
      
        DistAntNumero2?: number

    }
}