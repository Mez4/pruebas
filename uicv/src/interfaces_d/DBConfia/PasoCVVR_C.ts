export namespace DBConfia_PasoCVVR_C {
        
    export interface IClientesvr {
              
        Fecha?: string
      
        Distribuidorid?: number
      
        CveCli?: string
      
        NombreCom?: string
      
        EstatusID?: string
      
        FechaUltimoPago?: string
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string

    }
    export interface ICreditos_VW {
              
        DistribuidorCV?: number
      
        ClienteVR?: string
      
        ClienteCV: number
      
        Credito?: number
      
        Capital?: number
      
        Abonos?: number
      
        Importe?: number
      
        Saldo?: number
      
        Sal_atrasado?: number
      
        DiasAtr?: number
      
        FechaRegistro?: string
      
        EstatusID?: string
      
        Estatus: string
      
        ColorEstatus: string

    }
    export interface ICreditosvr {
              
        fecha?: string
      
        NoCda?: number
      
        DistribuidorID?: number
      
        CveCli?: string
      
        Plazos?: number
      
        Capital?: number
      
        Importe?: number
      
        Abonos?: number
      
        saldo?: number
      
        Sal_atrasado?: number
      
        DiasAtr?: number
      
        fechaRegistro?: string
      
        EstatusID?: string

    }
    export interface IDistribuidores {
              
        Fecha?: string
      
        Distribuidorid?: number
      
        nombreCom?: string
      
        SucursalValeID?: number
      
        SucursalVale?: string
      
        Nocreditos?: number
      
        SaldoActual?: number
      
        FechaPrimerCanje?: string
      
        FechaUltimoCanje?: string
      
        EstatusID?: string

    }
}