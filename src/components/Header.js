import './Header.css';
import McMasterLogo from '../images/McMasterLogo.svg';
import searchIcon from '../images/search.svg';
import menuIcon from '../images/menu.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import { auth } from '../Firebase';

function Header() {
	const [currentPage, setCurrentPage] = useState('home');
	const [user] = useAuthState(auth);

	function signIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}

	return (
		<header className="Header">
			<section className="HeaderBanner">
				<img className="McMasterLogo" src={McMasterLogo} alt="McMaster Logo"></img>
				<h1 className="HeaderTitle">MAC OFF-CAMPUS HOUSING</h1>
				<div className="HeaderButtons">
					<button>
						<img src={searchIcon} alt="searchIcon" />
						SEARCH
					</button>
					<button>
						<img src={menuIcon} alt="menuIcon" />
						MENU
					</button>
				</div>
			</section>

			<nav className="HeaderNav">
				<Link to="/">
					<button
						onClick={() => {
							setCurrentPage('home');
						}}
					>
						{currentPage === 'home' ? <div className="pageIndicator"></div> : <div></div>}
						<span className="headerText">HOME</span>
						{currentPage === 'home' ? <div className="pageIndicator"></div> : <div></div>}
					</button>
				</Link>
				<Link to="post-a-property">
					<button
						onClick={() => {
							setCurrentPage('postAd');
						}}
					>
						{currentPage === 'postAd' ? (
							<div className="pageIndicator"></div>
						) : (
							<div></div>
						)}
						<span className="headerText">POST AN AD</span>
						{currentPage === 'postAd' ? (
							<div className="pageIndicator"></div>
						) : (
							<div></div>
						)}
					</button>
				</Link>
				<Link to="available-properties">
					<button
						onClick={() => {
							setCurrentPage('properties');
						}}
					>
						{currentPage === 'properties' ? (
							<div className="pageIndicator"></div>
						) : (
							<div></div>
						)}
						<span className="headerText">AVAILABLE PROPERTIES</span>
						{currentPage === 'properties' ? (
							<div className="pageIndicator"></div>
						) : (
							<div></div>
						)}
					</button>
				</Link>
				{user === null ? (
					<button onClick={signIn}>Login</button>
				) : (
					<div>
						<h3>Welcome {user.displayName}</h3>
						<button
							onClick={() => {
								auth.signOut();
							}}
						>
							Logout
						</button>
					</div>
				)}
			</nav>
		</header>
	);
}

export default Header;
