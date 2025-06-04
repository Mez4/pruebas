import React from 'react'
import { Link, Redirect } from 'react-router-dom'
// import { IEstadoSeguridad } from '../../../interfaces/seguridad/IEstadoSeguridad'
// import { IModulo } from '../../../interfaces/seguridad/IModulo'
import { LoginContainer } from '../../app/comp/LoginContainer'
import { LoginTitle } from '../../app/comp/LoginTitle'

// type ModuleSelectType = {
//    oidc: IOidc
//}
export const ModuleSelect = () => {

    // Get the modules
    /*
    const moduleListDefault: IModulo[] = []
    const moduleList = props.oidc.Acceso?.reduce((pv, cv) => {

        if (pv.filter(p => p.ModuloID === cv.ModuloID).length <= 0)
            pv.push({ ...cv })
        return pv
    }
        , moduleListDefault)

    // Check if we only have one module
    if (moduleList?.length === 1)
        return <Redirect to={`/app/${(moduleList ?? [])[0].ModuloRuta}`} />
    */

    // Render the component
    return (
        <LoginContainer>
            <LoginTitle />
            <div>
                <h4 className="text-muted font-size-18 mb-1 text-center">Accesos</h4>
                <p className="text-muted text-center mb-4">Seleccione un modulo al que desee ingresar</p>

                <div className="list-group mt-3">

                </div>
            </div>

        </LoginContainer>
    )
}

/*
{moduleList?.map(m => (
    <Link key={m.ModuloID} to={`/app/${m.ModuloRuta}`} className="list-group-item list-group-item-action">
        <i className={`fas fa-${m.ModuloIcono} me-2`} />
        {m.ModuloEtiqueta}
    </Link>
))}
*/
