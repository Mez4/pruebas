export namespace DBConfia_Archivo {
        
    export interface IauditoriaSesiones {
              
        sesionId: number
      
        fhInicio: string
      
        fhFin?: string
      
        iPAddress?: string
      
        PersonaID: number
      
        usuarioId: number

    }
}