import React from 'react'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

import axios from 'axios'

import { ModalWin } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

import { Col, Container, Row } from 'react-grid-system'
import { FaEye } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'

import { Tree } from 'primereact/tree'

/** Propiedades de la forma de administracion de membresias */
type FormaMembresiasType = {
    Item: any
    oidc: IOidc
    ui: iUI
    mostrar: boolean
    cbActualizar(Item: any): any
    fnCancelar(): any
}

/**
 * Forma para editar las membresias
 * @param props propiedades de las generales
 * @returns Componente de react
 */
export const FormaMembresias = (props: FormaMembresiasType) => {

    // Estado de nuestro componente
    const [Estado, definirEstado] = React.useState<{ moduloId: number, checked: any[], expanded: any[], selected: any, memberships: any[], roles: any[], newMembership: any[] }>({

        // Modules
        moduloId: 0,
        checked: [],
        expanded: [],
        selected: null,

        // Catalogos
        memberships: [],
        roles: [],
        newMembership: []
    })

    // Query the data and use it on our server
    const queryRolesCatalog = async () => {
        const rolesSrv = await axios.get(`${GetServerUrl()}sistema/usuarios/catalog/roles/0`, GenerarCabeceraOIDC(props.oidc))
        const roles = rolesSrv.data
        definirEstado(e => ({ ...e, roles }))
    }

    // Query the data and use it on our server
    const queryRolesUser = async () => {
        const membershipsSvr = await axios.get(`${GetServerUrl()}sistema/usuarios/roles/${props.Item.UsuarioID}`, GenerarCabeceraOIDC(props.oidc))
        if (membershipsSvr.data)
            definirEstado(e => ({ ...e, memberships: membershipsSvr.data.filter(m => !m.ProductoID)[0].Accesos, newMembership: membershipsSvr.data.filter(m => !m.ProductoID)[0].Accesos }))
        else
            definirEstado(e => ({ ...e, memberships: [], newMembership: [] }))
    }

    // Load our data
    React.useEffect(() => {
        (async () => {
            await queryRolesCatalog()
        })()
    }, []);

    // Load our user permissions
    React.useEffect(() => {

        // If our user is not null
        if (props.Item !== undefined && props.mostrar) {
            (async () => {
                await queryRolesUser()
            })()
        }
        else {
            definirEstado(e => ({ ...e, moduloId: 0 }))
        }

    }, [props.Item, props.mostrar])

    // const RenderRolePermission = ({ Role: Rol }: { Role: any }): JSX.Element => {

    //     // Buscamos nuestro modulo dentro del arreglo de modulos
    //     let RoleFound: boolean = false
    //     const module = Estado.newMembership.find(nm => nm.ModuloID === Estado.moduloId)
    //     if (module) {
    //         RoleFound = module.Roles.find(r => r.RolID === Rol.RolID) ? true : false
    //     }

    //     console.log("module", module)

    //     return (
    //         <div className="text-dark">
    //             <div className="inbox-item">
    //                 <div className="inbox-item-img float-start me-1">
    //                     <i style={{ fontSize: "22px" }} className={`avatar-sm rounded-circle ${Rol.RolIcono}`} />
    //                 </div>
    //                 <p className="inbox-item-text font-size-14 has-text-weight-semibold mb-0">
    //                     <i className={`fa fa-${RoleFound ? "check-square" : "square"}`}
    //                         onClick={() => {

    //                             // Alert our value
    //                             alert(JSON.stringify(module ?? {}))
    //                             alert(JSON.stringify(module?.Roles ?? {}))
    //                             alert(JSON.stringify(Rol))


    //                             // Send our role to our newMemberships (without functions)
    //                             if (module && module.Roles.Find(r => r.RolID === Rol.RolID)) {

    //                                 Estado.newMembership.map(e => e.ModuloID === Estado.moduloId ? ({ ...e, Roles: e.Roles.filter(r => r.RolID === Rol.RolID) }) : e)

    //                                 definirEstado(e => ({ ...e, newMembership: Estado.newMembership.filter(ne => ne.ModuloID === Rol.ModuloID) }))
    //                             }



    //                         }} />
    //                     &nbsp;{Rol.RolNombre}
    //                 </p>
    //                 <p className="inbox-item-text mb-0">{Rol.RolEtiqueta}</p>
    //                 <button style={{ display: "flex", alignItems: "center" }} className="asstext inbox-item-date text-primary"><FaEye className="me-1" /> Ver Funciones...</button>
    //             </div>
    //         </div>
    //     )
    // }

    // Render the component 
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Membresias del usuario
                </h5>
                <button onClick={props.fnCancelar} type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </ModalWin.Header>
            <ModalWin.Body className="p-3">

                <p className="has-text-weight-semibold mb-0">Modulo</p>
                <select
                    value={Estado.moduloId}
                    onChange={(v) => {
                        console.log("Value", v.target.value)
                        if (v.target.value) {
                            definirEstado(e => ({ ...e, moduloId: parseInt(v.target.value) }))
                        }
                        else {
                            definirEstado(e => ({ ...e, moduloId: 0 }))
                        }
                    }}
                    className="form-select"
                    aria-label="Default select example"
                >
                    <option value={0}>Selecciona un menú</option>
                    {Estado.roles.map((r, rId) => (
                        <option key={rId} value={r.ModuloID}>{r.ModuloNombre}</option>
                    ))}
                </select>

                {Estado.moduloId === 0 &&
                    <div className="mt-2 mb-2 ">
                        <span className="has-text-weight-semibold"> Seleccione un modulo </span>
                    </div>
                }
                {Estado.moduloId !== 0 &&
                    <Container>
                        <Row>
                            <Col sm={12} md={6}>
                                <p className="has-text-weight-semibold mb-0 mt-3">Roles</p>
                                <hr className="mt-0 mb-2" />
                                <div className="inbox-wid">
                                    {/* {Estado.roles.find(r => r.ModuloID === Estado.moduloId).Roles.map((r, rId) => ( 
                                        // <RenderRolePermission key={rId} Role={r} />
                                        // <div key={rId} className="text-dark">
                                        //     <div className="inbox-item">
                                        //         <div className="inbox-item-img float-start me-1">
                                        //             <i style={{ fontSize: "22px" }} className={`avatar-sm rounded-circle ${r.RolIcono}`} />
                                        //         </div>
                                        //         <p className="inbox-item-text font-size-14 has-text-weight-semibold mb-0">
                                        //             <i className={`fa fa-${(Estado.newMembership.find(nm => nm.ModuloID === r.ModuloID) == {} as any) ? "check-square" : "square"}`}
                                        //                 onClick={() => {

                                        //                     // Alert our value
                                        //                     alert(JSON.stringify(r))

                                        //                     // Send our role to our newMemberships (without functions)
                                        //                     if (Estado.newMembership.find(nm => nm.ModuloID === r.ModuloID)) {
                                        //                         definirEstado(e => ({ ...e, newMembership: Estado.newMembership.filter(ne => ne.ModuloID === r.ModuloID) }))
                                        //                     }
                                        //                     else {

                                        //                     }


                                        //                 }} />
                                        //             &nbsp;{r.RolNombre}
                                        //         </p>
                                        //         <p className="inbox-item-text mb-0">{r.RolEtiqueta}</p>
                                        //         <button style={{ display: "flex", alignItems: "center" }} className="asstext inbox-item-date text-primary"><FaEye className="me-1" /> Ver Funciones...</button>
                                        //     </div>
                                        // </div>
                                     ))}
                                     */}
                                    <Tree value={[

                                    ]} selectionMode="checkbox" selectionKeys={Estado.selected} />
                                </div>
                            </Col>
                            <Col sm={12} md={6}>
                                <p className="has-text-weight-semibold mb-0 mt-3">Funciones</p>
                                <hr className="mt-0 mb-2" />
                            </Col>
                        </Row>
                    </Container>
                }
            </ModalWin.Body>
        </ModalWin>
    )
}
