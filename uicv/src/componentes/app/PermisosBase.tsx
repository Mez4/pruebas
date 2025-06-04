import axios from 'axios'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-grid-system'
import { MdOutlineError } from 'react-icons/md'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../global/variables'
import { IEstado } from '../../interfaces/redux/IEstado'
import { DefinirPermisos } from '../../redux/ui/acciones'
import { Spinner } from '../global'
import { toast } from 'react-toastify'

const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

export const PermisosBase = () => {

    // Efecto para el error al obtener los permisos
    const [error, setError] = React.useState(true)
    const [permission, setPermission] = React.useState();
    // var error : any = []
    const checkUserOpen = async () => {

    }
    // Use the effect
    React.useEffect(() => {
        const queryPermissions = async () => {

            // Query the data from the service
            try {
                axios.get(`${GetServerUrl()}Sistema/Usuarios/pa/${Estado.oidc.user.profile.UsuarioID}`, GenerarCabeceraOIDC(Estado.oidc))
                    .then((res: any) => {
                        res = res.data
                        // EN EL ENDPOINT CHECAMOS QUE TIPO DE ESTATUS LLEGA
                        if (res.status) {
                            Dispatch(DefinirPermisos(res.data));
                            setError(res.status);
                        } else {
                            switch (res.accion) {
                                case 1:
                                    setTitle("No tiene acceso fuera de horario laboral");
                                    setSubtitle("El horario es de 7 am - 6pm");
                                    setError(res.status);
                                    break;
                                case 2:
                                    setTitle("Error al obtener los permisos")
                                    setSubtitle("Intente actualizar la pagina");
                                    setError(res.status);
                                    break;

                            }
                        }
                        //  Dispatch(DefinirPermisos(res.data))


                    }).catch((err) => {
                        setTitle("Error al obtener los permisos")
                        setSubtitle("Intente actualizar la pagina");
                        setError(false);


                    });
                // Obtenemos los permisos
                // const queryPermisos = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/pa/${Estado.oidc.user.profile.UsuarioID}`, GenerarCabeceraOIDC(Estado.oidc))).data
                // Dispatch de los permisos
                // Dispatch(DefinirPermisos(queryPermisos))
            }
            catch (err: any) {
                // setError(true)
                toast.error("Acceso denegado")
                // error = err;
                console.log(err.accion);

            }
        }
        queryPermissions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Obtenemos el estado
    const Estado = useAppSelector<IEstado>(estado => estado)

    console.log('ESTADOF', Estado)
    const Dispatch = useDispatch()
    const [title, setTitle] = useState("Obteniendo Permisos")
    const [subtitle, setSubtitle] = useState("Espere un momento...")


    // Render del componente
    return (
        <Container className='d-flex align-items-center vh-100 vw-100 justify-content-center'>
            <Row>
                <Col >
                    {error &&
                        <div className='w-100 has-text-centered d-flex justify-content-center'>
                            <div className='mx-2 fs-4 fst-italic h-100'>{title}</div>
                            <Spinner />
                        </div>
                    }
                     {!error &&
                        <div className='has-text-centered'>
                            <div className='mb-2 fs-4'>{title}</div>
                            <div className='mb-2 fs-6'>{subtitle}</div>
                            {error && <Spinner />}
                            {!error && <span><MdOutlineError /></span>}
                        </div>
                    }
                </Col>
            </Row>
        </Container>
    )
}
