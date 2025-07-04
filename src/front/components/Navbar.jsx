import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">JWT system</span>
				</Link>
				<div className="ml-auto">
					<Link to="/signup">
						<button className="btn btn-outline-primary me-2">Sign Up</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-primary me-2">Log In</button>
					</Link>
					<Link to="/private">
						<button className="btn btn-success">Private</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};