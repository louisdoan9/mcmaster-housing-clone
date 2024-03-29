import './PropertyListings.css';
import { useState, useEffect } from 'react';

import CheckLogin from '../../Auth/CheckLogin';
import Login from '../../Auth/Login/LoginPage';

import PropertySidebar from '../../components//PropertyListingSidebar/PropertySidebar';
import DisplayProperty from './DisplayProperty';

import sortProperties from '../../Helper/sortProperties';
import filterProperties from '../../Helper/filterProperties';

function PropertyListings() {
	const user = CheckLogin()[0];
	const [loading, setLoading] = useState(true);
	const [propertyList, setPropertyList] = useState([]); // shown properties (may be filtered)
	const [allPropertyList, setAllPropertyList] = useState([]); // all properties (used to reset filter)

	const numPropertiesPerPage = 6;
	const [displayedPropertyRange, setDisplayedPropertyRange] = useState(
		localStorage.displayedPropertyRange
			? JSON.parse(localStorage.displayedPropertyRange)
			: [1, 1 + numPropertiesPerPage]
	); // Ex. displays the properties numbered from [start, end]

	// sort/filter properties by the ones saved in localStorage
	useEffect(() => {
		applySavedSortAndFilters(setAllPropertyList, setPropertyList, setLoading);
		localStorage.setItem('displayedPropertyRange', JSON.stringify(displayedPropertyRange));
	}, [displayedPropertyRange]);

	function createPageButtons() {
		const numOfPages = Math.ceil(propertyList.length / numPropertiesPerPage);
		let pageButtons = [];
		for (let i = 0; i < numOfPages; i++) {
			pageButtons.push(
				<button
					onClick={() => {
						setDisplayedPropertyRange([
							1 + i * numPropertiesPerPage,
							numPropertiesPerPage + i * numPropertiesPerPage + 1,
						]);
						window.scrollTo({
							top: 0,
							behavior: 'smooth',
						});
					}}
					// if current displayRange is same as the one button is setting to, set button as active
					className={displayedPropertyRange[0] === 1 + i * numPropertiesPerPage ? 'active' : ''}
				>
					{i + 1}
				</button>
			);
		}
		return pageButtons;
	}

	function resetPropertyPage() {
		setDisplayedPropertyRange([1, 1 + numPropertiesPerPage]);
	}

	if (user === null) {
		return <Login />;
	} else {
		return (
			<main className="property-listing-page">
				<PropertySidebar
					propertyList={propertyList}
					setPropertyList={setPropertyList}
					allPropertyList={allPropertyList}
					resetPropertyPage={resetPropertyPage}
				/>

				<div className="property-listings-container">
					<section className="property-listings">
						{loading ? (
							<div>Loading...</div>
						) : (
							propertyList
								.slice(displayedPropertyRange[0] - 1, displayedPropertyRange[1] - 1)
								.map((property) => {
									return <DisplayProperty property={property} />;
								})
						)}
					</section>
					<section className="property-listings-pages">
						<button
							onClick={() => {
								if (displayedPropertyRange[0] - numPropertiesPerPage > 0) {
									setDisplayedPropertyRange([
										displayedPropertyRange[0] - numPropertiesPerPage,
										displayedPropertyRange[1] - numPropertiesPerPage,
									]);
								}
								window.scrollTo({
									top: 0,
									behavior: 'smooth',
								});
							}}
						>
							Previous
						</button>
						{createPageButtons()}
						<button
							onClick={() => {
								if (
									displayedPropertyRange[1] + numPropertiesPerPage <=
									propertyList.length + numPropertiesPerPage
								) {
									setDisplayedPropertyRange([
										displayedPropertyRange[0] + numPropertiesPerPage,
										displayedPropertyRange[1] + numPropertiesPerPage,
									]);
								}
								window.scrollTo({
									top: 0,
									behavior: 'smooth',
								});
							}}
						>
							Next
						</button>
					</section>
				</div>
			</main>
		);
	}
}

function applySavedSortAndFilters(setAllPropertyList, setPropertyList, setLoading) {
	fetch('https://mcmaster-housing-clone-api.vercel.app/property')
		.then((response) => response.json())
		.then((data) => {
			// if localStorage.filters empty, sort all properties by sortBy in localStorage or default LATEST
			if (localStorage.filters === undefined) {
				if (localStorage.sortBy !== undefined) {
					sortProperties(JSON.parse(localStorage.sortBy), data, setPropertyList);
				} else {
					sortProperties('LATEST', data, setPropertyList);
				}
			}
			// if localStorage.filters not empty, then sortBy also not empty (default LATEST when filtered)
			// filter all properties by filters in localStorage, sort filtered by the sortBy in localStorage
			else {
				const newList = filterProperties(data, JSON.parse(localStorage.filters));
				sortProperties(JSON.parse(localStorage.sortBy), newList, setPropertyList);
			}
			setAllPropertyList(data);
			setLoading(false);
		});
}

export default PropertyListings;
