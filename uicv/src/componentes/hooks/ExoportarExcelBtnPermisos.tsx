
import React from 'react'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { IUsuarioOidc } from '../../interfaces/oidc/IUsuarioOidc'
import { IEstado } from '../../interfaces/redux/IEstado'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { DefinirModulo } from '../../redux/ui/acciones'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

/* 
const PANTALLA = {
    CreditosReporte1945: 278
} */
const PERMISO = {
    ExpReporteGlobal: 2939,/* 2915 Preubas */
    ExpReporte_1549_1506_1625: 2933,
    ExpReporte_1625 : 2916,
    ExpReporte_191: 2934,
    ExpReporte_221_DetColocacion_DetColocacionSocia: 2935,
    ExpReporteActivacion: 0,  
    ExpReporte_1600: 2834   
}

const USUARIO = {
    master: 0,
    director: 1,
    zonal: 2,
    gerente: 3,
    coordinador: 4,
    cajera: 5
}



/**
 * Hook para dar acceso a los modulos
 * @param {number} ModuloID al cual debemos de validar el acceso 
 * 278
 * 2837
 */

const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

export const permisoExportar = (/* PantallaID, */ PermisoID): boolean => {
    const [ExpPermisos, setExport] = React.useState(false)
    const [canExport, setCanExport] = React.useState(false)

    // Obtenemos acceso a nuestro estado en redux
    const estado = useAppSelector<IEstado>(estado => estado)

    const valitateUser = async () => {
        try {
            const resp: any = await axios.post(`${GetServerUrl()}creditos/GrupoDetalle/TipoUsuario`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${estado.oidc.user.access_token}`
                }
            }).then(res=> res.data)

            // setExport(resp.tipoUsuario == USUARIO.master)
            
           /*  if (PantallaID == PANTALLA.CreditosReporte1945 &&  PermisoID == PERMISO.ExpReporte_1549_1506_1625 && resp.tipoUsuario <= USUARIO.zonal) 
                setCanExport(true) */
            // console.log(PermisoID,resp.tipoUsuario);
            
            // if (PermisoID == PERMISO.ExpReporte_1549_1506_1625 && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)

            // if (PermisoID == PERMISO.ExpReporte_1625 && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)

            // if (PermisoID == PERMISO.ExpReporteGlobal && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)
            // if (PermisoID == PERMISO.ExpReporte_191 && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)
            // if (PermisoID == PERMISO.ExpReporte_221_DetColocacion_DetColocacionSocia && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)
            // if (PermisoID == PERMISO.ExpReporteActivacion && resp.tipoUsuario <= USUARIO.zonal) 
            //     setCanExport(true)
            // if (PermisoID == PERMISO.ExpReporteActivacion && resp.tipoUsuario <= USUARIO.zonal) 
                setCanExport(true)
            


        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(() => {
        if (estado.oidc.user != undefined) valitateUser()
    }, [estado.oidc])

    return ExpPermisos || canExport
}