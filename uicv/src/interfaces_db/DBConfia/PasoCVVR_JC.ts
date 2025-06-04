export namespace DBConfia_PasoCVVR_JC {
        
    export interface IClientesVR_VW {
              
        DistribuidorID?: number
      
        DistribCV?: number
      
        CveCli?: string
      
        Nocda?: number
      
        NombreCliente?: string
      
        FecUltimoPago?: string
      
        Importe?: number
      
        SaldoActual?: number
      
        SaldoAtraso?: number

    }
    export interface ICreditosActivos_VW {
              
        DistribuidorID?: number
      
        DistribCV?: number
      
        NombreDistribuidor?: string
      
        SucursalVale?: string
      
        SucursalValeID?: number
      
        CveCli?: string
      
        NombreCliente?: string
      
        Nocda?: number
      
        Plazos?: number
      
        Capital?: number
      
        Importe?: number
      
        Abonos?: number
      
        Saldo?: number
      
        Atrasado?: number
      
        DiaAtr?: number
      
        EstatusID?: string

    }
    export interface ICreditosVR {
              
        FechaInsercion?: string
      
        Nocda?: number
      
        DistribuidorID?: number
      
        CveCli?: string
      
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
    export interface ISociasVR {
              
        FechaInsercion?: string
      
        DistribuidorID?: number
      
        NombreCom?: string
      
        CURP?: string
      
        RFC?: string
      
        SucursalValeID?: number
      
        SucursalVale?: string
      
        CreditosActivos?: number
      
        SaldoActual?: number
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string
      
        EstatusID?: string
      
        DistribCV?: number

    }
}