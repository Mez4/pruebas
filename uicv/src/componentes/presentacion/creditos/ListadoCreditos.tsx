import React from 'react'

enum TipoConsulta { Cliente, Sucursal, Zona, Empresa }
enum TipoRender { Tabla, Lista }

/** Tipo de nuestro componente */
type ListadoCreditosTipo = {
    IdConsulta: any,
    Consulta: TipoConsulta,
    FechaInicio: Date,
    FechaFin: Date,
    RedireccionUrl: "",
    RedireccionVariable: "",
    Render: TipoRender
}

/**
 * Componente para mostrar un listado de los créditos
 * @param {ListadoCreditosTipo} props 
 * @returns Componente React
 */
const ListadoCreditos = (props: ListadoCreditosTipo) => {
    return (
        <div>

        </div>
    )
}

// Adicionamos los catalogos base
ListadoCreditos.TipoConsulta = TipoConsulta
ListadoCreditos.TipoRender = TipoRender

// Exportamos por defecto el listado de los créditos
export default ListadoCreditos