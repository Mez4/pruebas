export namespace DBConfia_ODP {
        
    export interface IODPBancomerEnvios {
              
        ODPBancomerEnvioID: number
      
        FechaEnvio?: string
      
        ConsecutivoDia?: number
      
        CuentaCargo?: string
      
        Tipo?: string
      
        UsuarioID: number
      
        FHRegistro: string
      
        NoBalance: number
      
        Convenio: string
      
        Archivo: string
      
        Vencimiento: string
      
        Estatus: string

    }
}