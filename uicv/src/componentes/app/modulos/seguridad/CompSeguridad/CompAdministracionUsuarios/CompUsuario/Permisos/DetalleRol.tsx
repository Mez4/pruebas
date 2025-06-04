import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { DBConfia_Seguridad } from '../../../../../../../../interfaces_db/DBConfia/Seguridad'
import { DBConfia_Sistema } from '../../../../../../../../interfaces_db/DBConfia/Sistema';

type TDetalleRol = {
    Rol: DBConfia_Seguridad.IRoles
    ProductoId?: number
}

type TEstado = {
    Cargando: boolean,
    Permisos?: DBConfia_Sistema.IPermisos_VW[]
}


const DetalleRol = ({ Rol, ProductoId }: TDetalleRol): React.ReactElement => {

    // Definimos nuestro estado
    const [estado, definirEstado] = React.useState<TEstado>({
        Cargando: false
    })

    // Rendereamos el componente
    return (
        <p className='mt-1 mb-0' style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
            <FaChevronRight className='mr-2' style={{ cursor: 'pointer' }} onClick={() => { definirEstado(e => ({ ...e, Cargando: true })) }} />
            <i className={`${Rol.Icono} mr-2`} />
            <span className='has-text-weight-semibold mr-5'>{Rol.Nombre}</span>
            {estado.Cargando && <i className='fa fa-spinner fa-spin' />}
        </p>
    )
}

export default DetalleRol