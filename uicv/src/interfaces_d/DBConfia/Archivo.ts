export namespace DBConfia_Archivo {
        
    export interface IPersonaEstatus {
              
        PersonaEstatusID: number
      
        PersonaID: number
      
        EstatusID: number

    }
    export interface IPersonas_Dcs_VW {
              
        PersonaID: number
      
        NombreCompleto: string
      
        DistribuidorID?: number
      
        ClienteID?: number
      
        CoordinadorID?: number
      
        creditoPromotorId?: number
      
        AnalistaID?: number
      
        DirectorMesaCreditoID?: number
      
        GestorCobranzaID?: number
      
        DirectorMesaCobranzaID?: number
      
        EstatusID?: number
      
        NombreEstatus?: string
      
        Clave?: string
      
        Color?: string
      
        FechaHoraRegistro?: string

    }
}