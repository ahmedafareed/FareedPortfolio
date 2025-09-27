import Home from '../page';

export default function TravelAliasPage() {
	// Simply reuse root homepage; middleware sets x-site-key (or path logic picks travel)
	return <Home />;
}
