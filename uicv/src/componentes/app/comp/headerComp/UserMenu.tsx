import React, { useState } from 'react'
import { AiOutlinePoweroff } from 'react-icons/ai'
import { FaDownload, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { FcSettings } from 'react-icons/fc'

type UserMenuType = {
    FNLogOut(): any
}
function UserMenu(props: UserMenuType) {

    // Test
    const [state, setState] = useState('')

    // Renderizar menu
    return (
        <div className="dropdown d-inline-block">
            <button
                onClick={() => setState(state === 'show' ? '' : 'show')}
                onBlur={() => setState('')}
                type="button" className="btn header-item waves-effect show pr-5 pl-5" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <FaUser size={20} />
            </button>
            <div className={`dropdown-menu dropdown-menu-end m-0 ${state}`} style={{ position: "absolute", inset: "0px auto auto 0px", transform: "translate(-100.5px, 71.4667px)" }} data-popper-placement="bottom-end">
                <button className="dropdown-item"><FaUser /> Perfil</button>
                <button className="dropdown-item"><FcSettings /> Configuración</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger"
                    onClick={() => {
                        alert("DOMO")
                    }}
                >
                    <AiOutlinePoweroff />
                    &nbsp;Cerrar sesión
                </button>
            </div>
            <button className="asstext dropdown-menu-end m-0">
                <FaDownload onClick={props.FNLogOut} title="Descargar Software Biometricos" style={{ color: "#555b6d" }} size={22} />
            </button>
            <button className="asstext dropdown-menu-end m-0">
                <FaSignOutAlt onClick={props.FNLogOut} title="Salir" style={{ color: "#555b6d" }} size={22} />
            </button>
        </div>
    )
}

export default UserMenu