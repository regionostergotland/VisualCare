var portfolios = [];
/*
	Lägg till fler portfolio-items genom att
	lägga till en ny:
	portfolios.push({
		'name': 'namn',
		'desc': 'beskrivning',
		'src': 'bild-länk',
		'link': 'länk till prototypen',
	});
*/
portfolios.push({
	'name': 'Statistik',
	'desc': 'Prototypen kan visa olika typer av data som till exempel köns och åldersfördelningen inom SVF.',
	'src': '/resources/images/protoAlder.png',
	"link": "prototype.html?prototype=0",
	'id': 0,
	'parameter': ["prototype", 0],
});

portfolios.push({
	'name': 'Sambandsdiagram',
	'desc': 'Ett sambandsdiagram som visar estimerade utgångsdatum baserad på normalfördelning.',
	'src': '/resources/images/protoScatter.png',
	"link": "prototype.html?prototype=3",
	'id': 3,
	'parameter': ["prototype", 3],
});
portfolios.push({
	'name': 'Sambandsdiagram med grafer',
	'desc': 'Flera sambandsdiagram med estimerade utgångsdatum baserad på normalfördelning. Prototypen innehåller även extra information om de personerna som finns i SVF.',
	'src': '/resources/images/proto4.png',
	"link": "prototype.html?prototype=5",
	'id': 5,
	'parameter': ["prototype", 5],
});
