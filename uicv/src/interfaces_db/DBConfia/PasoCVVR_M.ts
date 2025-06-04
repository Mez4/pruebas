export namespace DBConfia_PasoCVVR_M {
        
    export interface IClientesVW {
              
        DistribuidorCV?: number
      
        DistribuidorVR?: number
      
        ClienteCV: number
      
        ClienteVR?: string
      
        NombreCompleto?: string
      
        Importe?: number
      
        SaldoActual?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        FecUltimoPago?: string
      
        Capital?: number

    }
    export interface ICreditosVR {
              
        FechaPaso?: string
      
        NoCda?: number
      
        DistribuidorID?: number
      
        CveCli?: string
      
        Plazos?: number
      
        Capital?: number
      
        Importe?: number
      
        Abonos?: number
      
        SaldoActual?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        FechaRegistro?: string
      
        EstatusID?: string

    }
    export interface ICreditosVW {
              
        DistribuidorCV?: number
      
        ClienteVR?: string
      
        ClienteCV: number
      
        CreditoID?: number
      
        Capital?: number
      
        Abonos?: number
      
        ImporteTotal?: number
      
        SaldoActual?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        FechaRegistro?: string
      
        EstatusID?: string
      
        EstatusNombre: string
      
        Color: string

    }
    export interface ISociasVR {
              
        FechaPaso?: string
      
        DistribuidorID?: number
      
        NombreCom?: string
      
        SucursalValeID?: number
      
        SucursalVale?: string
      
        Creditos?: number
      
        SaldoActual?: number
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string
      
        EstatusID?: string

    }
}