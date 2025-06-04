import React, { useState } from 'react'
import { FaBell } from 'react-icons/fa'

function NotificationsMenu() {

    // Test
    const [state, setState] = useState('')

    // onMouseEnter={() => { setState('show') }} onMouseLeave={() => setState('')} onClick={() => { setState('') }}
    // Renderizar menu
    return (
        <div className="dropdown d-inline-block">
            <button
                onClick={() => setState(state === 'show' ? '' : 'show')}
                onBlur={() => setState('')}
                type="button" className="btn header-item waves-effect show pr-5 pl-5" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <FaBell size={20} />
                <span className="badge bg-danger rounded-pill" style={{ position: "absolute", top: "18px", right: "5px" }}>3</span>
            </button>
            <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end m-0 ${state}`} style={{ position: "absolute", inset: "0px auto auto 0px", transform: "translate(-100.5px, 71.4667px)" }} data-popper-placement="bottom-end">
                <div className="p-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <h5 className="m-0"> Notificaciones (258) </h5>
                        </div>
                    </div>
                </div>

                <div className="dropdown-divider"></div>

                <div data-simplebar="init" style={{ maxHeight: "230px" }}>
                    <div className="simplebar-wrapper m-0">
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{ right: "-11.1667px", bottom: "0px" }}>
                                <div className="simplebar-content-wrapper" style={{ height: "auto", overflow: "hidden scroll" }}>
                                    <div className="simplebar-content" style={{ padding: "0px" }}>

                                        <button className="asstext text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs me-3">
                                                    <span className="avatar-title border-success rounded-circle ">
                                                        <i className="mdi mdi-cart-outline"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">Your order is placed</h6>
                                                    <div className="text-muted">
                                                        <p className="mb-1">If several languages coalesce the grammar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        <button className="asstext text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs me-3">
                                                    <span className="avatar-title border-success rounded-circle ">
                                                        <i className="mdi mdi-cart-outline"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">Your order is placed</h6>
                                                    <div className="text-muted">
                                                        <p className="mb-1">If several languages coalesce the grammar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        <button className="asstext text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs me-3">
                                                    <span className="avatar-title border-success rounded-circle ">
                                                        <i className="mdi mdi-cart-outline"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">Your order is placed</h6>
                                                    <div className="text-muted">
                                                        <p className="mb-1">If several languages coalesce the grammar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>


                                        <button className="asstext text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs me-3">
                                                    <span className="avatar-title border-success rounded-circle ">
                                                        <i className="mdi mdi-cart-outline"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">Your order is placed</h6>
                                                    <div className="text-muted">
                                                        <p className="mb-1">If several languages coalesce the grammar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        <button className="asstext text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs me-3">
                                                    <span className="avatar-title border-success rounded-circle ">
                                                        <i className="mdi mdi-cart-outline"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">Your order is placed</h6>
                                                    <div className="text-muted">
                                                        <p className="mb-1">If several languages coalesce the grammar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="simplebar-placeholder" style={{ width: "auto", height: "415px" }}>
                        </div>
                    </div>
                    <div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}>
                        <div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}></div>
                    </div>
                    <div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}>
                        <div className="simplebar-scrollbar" style={{ transform: "translate3d(0px, 0px, 0px)", display: "block", height: "127px" }}></div>
                    </div>
                </div>

                <div className="p-2 border-top">
                    <button className="btn btn-sm btn-link font-size-14 w-100 text-center p-0 m-1">
                        Ver todas
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationsMenu
