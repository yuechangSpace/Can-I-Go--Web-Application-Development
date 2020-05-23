//1.get flights by DATE
//https://www.fareportallabs.com/docs/services/fareportal-partner-network-staging/operations/BookFlight?
//OR RapidAPI https://rapidapi.com/collection/flight-data-apis

//1.find all flights from A to B
var request = require("request");
var util = require('util');
var fs = require("fs");


const country = "US";//market country, where the user is in
const currency = "USD";
const date = "2020-06-28";
const locale = "zh"; //or en-US, the target result language
const originPlace = "PEK";
const destPlace = "JFK";

const write_json = (json)=>{
	fs.writeFile("summary.txt",JSON.stringify(json, null, 4),(err)=>{
		if (err) console.log("failed writing! "+err);
	})
}


const reques = util.promisify(request); 

async function create_session(){
	console.log("creating")
	var sessionOptions = {
	  method: 'GET',
	  url: 'https://tripadvisor1.p.rapidapi.com/flights/create-session',
	  qs: {currency: `${currency}`, ta: '1', c: '0', d1: `${destPlace}`, o1: `${originPlace}`, dd1: `${date}`},
	  headers: {
	    'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
	    'x-rapidapi-key': 'f227b489f9mshadcae6ddcab41dbp1db60fjsneb0e394d7b60',
	    useQueryString: true
	  }
	};
	const sid = await reques(sessionOptions, function(error, response, body) {
		if (error) throw new Error(error);
		return JSON.parse(body)
		// console.log(bd)
		// for (const prop in bd){
		// 	if (prop === "search_params") sid = bd[prop].sid;
		// }
	})
	console.log("hiiii")
	console.log("sid: "+sid)
	// return sid;
}

function poll(){
	const sid = create_session();
	console.log(sid)
	var poll_options = {
	  method: 'GET',
	  url: 'https://tripadvisor1.p.rapidapi.com/flights/poll',
	  qs: {
	    currency: 'USD',
	    n: '15',
	    ns: 'NON_STOP%2CONE_STOP',
	    so: 'PRICE',
	    o: '0',
	    sid: `${sid}`
	  },
	  headers: {
	    'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
	    'x-rapidapi-key': 'f227b489f9mshadcae6ddcab41dbp1db60fjsneb0e394d7b60',
	    useQueryString: true
	  }
	};

	request(poll_options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
		write_json(JSON.parse(body));

	});
}


create_session()