import React from 'react'
import { BsShieldLock } from 'react-icons/bs'

const RedireccionUsuario = () => {
    return (
        <div className="text-center" style={{ display: "flex", flexDirection: "column", minHeight: "90vh", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                <BsShieldLock size={32} />
                <div className="mx-3" style={{ height: "50px", width: "1px", backgroundColor: "darkgray" }} />
                <div>
                    <p className="my-0">Redireccionando para iniciar sesión</p>
                    <p className="my-0" style={{ fontWeight: 500 }}>Espere un momento...</p>
                </div>
            </div>
        </div>
    )
}

export default RedireccionUsuario