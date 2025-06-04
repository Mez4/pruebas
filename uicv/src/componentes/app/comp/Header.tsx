import React from 'react'
import { connect } from 'react-redux'
// import { CgMenu } from 'react-icons/cg'
import { FcPieChart } from 'react-icons/fc'
import { NotificationsMenu, UserMenu } from './headerComp'

// MediaQuery
import { IEstado } from '../../../interfaces/redux/IEstado'

// Logo img
import logo from '../../../theme/images/logo3.png'

type PageHeaderType = {

}
const PageHeader = (props: PageHeaderType) => {

    // Render our component
    return (
        <header id="page-topbar">
            <div className="navbar-header">
                <div className="d-flex">
                    <div className="navbar-brand-box">
                        <span className="logo logo-dark">
                            <span className="logo-sm">
                                <FcPieChart style={{ fontSize: 22 }} />
                            </span>
                            <span className="logo-lg">
                                <FcPieChart style={{ fontSize: 22 }} />
                                <span className="ms-2 fs-5 align-middle"><strong>Administración</strong></span>
                            </span>
                        </span>

                        <span className="logo logo-light text-white">
                            <span className="logo-sm">
                                <img src={logo} alt="logo img" style={{ width: "25px" }} />
                            </span>
                            <span className="logo-lg">
                                <img src={logo} alt="logo img" style={{ width: "25px" }} />
                                <span className="ms-2 fs-5 align-middle"><strong>Administración</strong></span>
                            </span>
                        </span>
                    </div>
                </div>

                <div className="d-flex">
                    <NotificationsMenu />
                </div>
            </div>
        </header>
    )
}
const mapStateToProps = (state: IEstado) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)
