export namespace DBConfia_PasoCVVR_EL {
        
    export interface IClientesVR {
              
        Fecha?: string
      
        DistribuidorID?: number
      
        CveCli?: string
      
        NombreCom?: string
      
        CURP?: string
      
        CveEnc?: string
      
        EstatusID?: string
      
        FecUltimoPago?: string
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string

    }
    export interface ICreditos_VW {
              
        IDClienteVR?: string
      
        IDClienteCV: number
      
        DistribuidorIDCV?: number
      
        CreditoID?: number
      
        Capital?: number
      
        Abonos?: number
      
        ImporteTotal?: number
      
        SaldoActual?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        FechaRegistro?: string
      
        MovimientoID?: string
      
        EstatusID?: string
      
        EstatusNombre?: string
      
        Color?: string

    }
    export interface ICreditosVR {
              
        Fecha?: string
      
        Nocda?: number
      
        DistribuidorID?: number
      
        CveCli?: string
      
        MovCli?: string
      
        CveEnc?: string
      
        Plazos?: number
      
        Capital?: number
      
        Importe?: number
      
        Abonos?: number
      
        Saldo?: number
      
        Atrasado?: number
      
        DiaAtr?: number
      
        FechaRegistro?: string
      
        EstatusID?: string

    }
    export interface IDistribuidoresVR {
              
        Fecha?: string
      
        DistribuidorID?: number
      
        NombreCom?: string
      
        SucursalValeID?: number
      
        SucursalVale?: string
      
        NoCreditos?: number
      
        SaldoActual?: number
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string
      
        EstatusID?: string

    }
    export interface ISaldos_VW {
              
        IDClienteVR?: string
      
        IDClienteCV?: number
      
        NombreCliente?: string
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string
      
        DistribuidorIDVR?: number
      
        DistribuidorIDCV?: number
      
        SucursalValeID?: number
      
        SucursalVale?: string
      
        Nocda?: number
      
        MovCli?: string
      
        NoCreditos?: number
      
        Saldo?: number
      
        capital?: number
      
        Importe?: number
      
        Atrasado?: number
      
        DiaAtr?: number
      
        FechaRegistro?: string
      
        FecUltimoPago?: string
      
        EstatusID?: string
      
        Fecha?: string

    }
}