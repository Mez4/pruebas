import React, {useRef, useState} from 'react'
import { ActionSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { BiSearchAlt } from 'react-icons/bi'

import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

type AsentamientoTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    Cascada?: boolean,
    Datos: { 
        EstadoId: number, 
        MunicipioId: number,
        TipoAsentamientoId: number,
        CodigoPostalID: number
    },
    oidc: IOidc
}
const Asentamientos = (props: AsentamientoTipo) => {

    // Checamos que el componente este montado
    let isMounted = useRef(true)

    // Declaramos el estado del componente
    const datosDefecto: any[] = []
    const [Estado, definirEstado] = useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })

    // Declare the FNGet
    const FNGetLocal = () => {        
        if(props.Datos.EstadoId > 0 && props.Datos.MunicipioId > 0)
        {
            definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))
            axios.post(`${GetServerUrl()}Catalogos/Asentamiento/get`, props.Datos, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.oidc.user.access_token}`
                }
            })
            .then(respuesta => {
                if (isMounted)
                    definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
        }
        else 
        {
            definirEstado(e => ({ ...e, Datos: [] }))
        }
    }

    // On use effect
    React.useEffect(() => {
        if(!props.Cascada)
        {
            FNGetLocal()
        }        
        // eslint-disable-next-line
    }, [])

    // <<
    // Effectos de la forma
    // #################################################

    // Generamos el placeholder
    let placeholder: string
    if (Estado.Error)
        placeholder = "Error!"
    else if (Estado.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Seleccione un Asentamiento"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.AsentamientoID, label: e.Asentamiento, group: e.Estado }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (             
            <CustomSelect2 
                name={props.name ?? 'AsentamientoID'} 
                funcionActualizacion={FNGetLocal} 
                disabled={props.disabled ?? false} 
                addDefault={true} 
                placeholder={placeholder} 
                label={'Asentamiento'} 
                options={opciones} 
                isMulti={false} 
                mostrarBoton={true} 
            />
        )

    // Si queremos el control con etiqueta
    return (
        <div className="input-group">
            <ActionSelect
                disabled={props.disabled ?? false}
                label="Asentamiento"
                name="AsentamientoID"
                placeholder="Seleccione el Asentamiento"
                options={opciones}
                addDefault={false}
                // valor={props.initialValues.SucursalId}
                // accion={cbSucursal}
                // ref={refSucursal}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}>
                <BiSearchAlt size={22} />
            </button>
        </div>
    )
}

export default Asentamientos