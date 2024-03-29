import { Link } from 'react-router-dom';
import bed from '../../images/bed.svg';
import money from '../../images/money.svg';
import calender from '../../images/calander.svg';
import lease from '../../images/lease.svg';
import posted from '../../images/posted.svg';

// returns link to displayed property page
// also passes in property info as a state
function DisplayProperty({ property }) {
	return (
		<Link
			className="property-display"
			to={`/available-properties/${property.location.replace(/\s+/g, '-')}`}
			state={property}
		>
			<div className="property-img-container">
				<img src={property.propertyImage[0]} alt="" loading="lazy" />
			</div>
			<div className="property-info">
				<h2>{property.location.toUpperCase()}</h2>
				<div className="divider"></div>
				<div className="property-sub-info">
					<h3>
						<img src={lease} alt="" /> {property.rental_term}
					</h3>
					<h3>
						<img src={money} alt="" /> ${property.cost_per_month} a month
					</h3>
					<h3>
						<img src={bed} alt="" /> {property.available_bedrooms} beds available
					</h3>
					<h3>
						<img src={calender} alt="" />
						Available:{' '}
						{new Date(property.date_available).toLocaleString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</h3>
					<h3>
						<img src={posted} alt="" /> Posted on {property.date}
					</h3>
				</div>
			</div>
		</Link>
	);
}

export default DisplayProperty;
