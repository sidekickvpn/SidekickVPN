import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import AuthStateContext from '../contexts/AuthStateContext';
import { logoutUser } from '../reducers/authReducer';

const Navbar = ({ alertCount }) => {
	const { isAuthenticated, user } = useContext(AuthStateContext);
	const dispatch = useContext(AuthContext);

	return (
		<div className="navbar navbar-expand-lg navbar-dark bg-primary">
			<div className="container">
				<Link to="/" className="navbar-brand">
					SidekickVPN
				</Link>
				<button
					className="navbar-toggler"
					data-toggle="collapse"
					data-target="#navbarResponsive"
					aria-controls="navbarResponsive"
					aria-expanded="false"
					aria-label="Toggle nagivation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navbarResponsive">
					{/* <div className="navbar-nav d-lg-none d-xl-none">
						{isAuthenticated ? (
							<>
								<NavLink to="/devices" className="nav-item nav-link">
									<i className="fas fa-desktop inline-icon" />
									Devices
								</NavLink>
								<NavLink to="/reports" className="nav-item nav-link">
									<i className="fas fa-flag inline-icon" />
									<span>Reports</span>
									<span className="badge">{alertCount}</span>
								</NavLink>
							</>
						) : (
							''
						)}
					</div> */}
					<div className="ml-auto d-lg-flex d-md-block">
						<div className="navbar-nav">
							{isAuthenticated ? (
								<>
									<NavLink to="/devices" className="nav-item nav-link">
										<i className="fas fa-desktop inline-icon" />
										Devices
									</NavLink>
									<NavLink to="/reports" className="nav-item nav-link">
										<i className="fas fa-flag inline-icon" />
										<span>Reports</span>
										{alertCount > 0 ? (
											<span className="badge badge-info ml-1">
												{alertCount}
											</span>
										) : (
											''
										)}
									</NavLink>
									<NavLink to="/filter" className="nav-item nav-link">
										<i className="fas fa-filter" />
										Filter
									</NavLink>
									<Link className="nav-item nav-link" to="/devices">
										<i className="fas fa-user inline-icon" />
										{`${user.firstname} ${user.lastname}`}
									</Link>
									<button
										className="btn btn-flat nav-item nav-link pointer"
										style={{ paddingTop: '0.8em' }}
										onClick={() => logoutUser(dispatch)}
									>
										Logout
									</button>
								</>
							) : (
								<>
									<NavLink className="nav-item nav-link" to="/login">
										Login
									</NavLink>
									{/* <NavLink className="nav-item nav-link" to="/register">
										Register
									</NavLink> */}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Navbar;
