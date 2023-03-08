import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const profile = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { username } = req.query;
	const user = (username as string) || "onlysiamak";

	const config = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://unsplash.com/napi/users/${user}/?stats=true`,
		headers: {
			authority: "unsplash.com",
			accept: "*/*",
			"accept-language": "en-US",
			"cache-control": "no-cache",
			cookie:
				"ugid=e01d12c741e39e75dacac8033f8784e55517137; xp-search-explore-top-affiliate-outside-feed-x-v2=control; uuid=eed2af40-eb3d-11ec-af82-d144abbcd760; xpos=%7B%7D; azk=eed2af40-eb3d-11ec-af82-d144abbcd760; azk-ss=true; auth_user_id=334093; xp-unsplash-plus=; xp-unsplash-plus-2=Control; intercom-id-njw7pl12=02b62eee-e7b6-44d1-8ba6-86f26707a10f; xp-japanese=disabled; xp-unsplash-plus-3=Experiment; xp-disable-affiliates=control; _gid=GA1.2.561926544.1678223778; lux_uid=167829510565646965; _sp_ses.0295=*; un_sesh=c2NFcTJkemZuY3djN3VodVYyY3JTRHB2dm5HcFdwNlFPeVFIZXBqVnJqeno4R1BIVGZ6SEhiTnBrK084dERRRDR2MDlxcGZEK2l2QUZ1Uk5aTmZ5Sk1BYkZjWjZxTUcxT29tUXR6TFdxbzFjbmRUam90M2U3NXV0K3pWRTkxNXpURDFJaG9SMGlsODB2UWxPOTFJYzljNXh5eWVpVUI1dnMzaWxVQnFhNm5WZ21zMEVnWXlvMzN1djhlMTc4dms2WG5UeXhTZHUzc2d2bm1QV25WZ2RkVWRPelNiOS9YTnZ6cUx4Qk5FdHI1a0tjMEN2RWJ6Mm9sdTRtalNtelRmY1VEZFNwYURJWEhPNTFraklLeEo0OE1KamFUbWZaTXRpc3VWUE8rQVJBSDUxc3gvcFJTSDRsdGpHUEFGMkUzRzdhRURpWldZSEdpcXF6Q2w4Ni9iYkJLcVVlNVBWTGprS2RDY3FqVTFxbzRGV08rTEZEYjNJVmt1cm5mYXlsS2dodVBTTVoxSDB0ekNZK0VyTXIyMU9NM3ZIUkZXQTgyQlhGRzZtYVh6TU0rQlF2dU51WVk1ZUdUSWZicW1UYUdKQzRaOTRBdTNqMHdROTR1Q0c0RnhHSktqVU0wNXdvaFEwSkl0MWJ0V2o5engvQXlSVUNtcXBoYlRyUXhDOWt0RU1ncmpQY1dNZnhXUkYzbnhxMmFKaUdGOWtONUZwVlBaeXRQYkFoTjBRWkl6djlTakllbnVtZXpGcm1vUi9hNFJHY05abUp0amljcEZLeExDeWZadVpJSFR5Q2o0QTBTWU56a0tUbllxR3FZbXp4NHMrclZxN0lzWjNXOTJ0VmJZcC0tQ3h2MldtSTh1TmNOSk9QNCtjemhsdz09--bfbe959d9274b4d733a9ffc6d5df8b8ef33df122; _ga_21SLH4J369=GS1.1.1678295111.39.1.1678296573.0.0.0; _ga=GA1.1.800069661.1655141171; _sp_id.0295=a22e7caf-6949-480e-b89d-1084e8a9d171.1655141171.582.1678296574.1678223867.ef830747-7168-4ef1-a68c-2649eea2b68e.ba0f69b0-1093-4d3a-a395-d75514bd7aa4.ced76e34-62bd-426c-afd1-7a708eb25582.1678295111214.7; _gat=1; ugid=e01d12c741e39e75dacac8033f8784e55517137; un_sesh=cmRkenZINjNMQ21OU2FoemdoZFdlSElheUZXY2NTc05KS1lkaEROeTdHL0xCVlhoZnNxNFQ4OUJYVXVwZGl3aHVaRnJXZUdPQ1MzODZpNC9RcmVVWGhSWDV0a095RU1SMUI5SnowRThTNzE4T25uelZKY1lKMDF1ZWEwL2xMeENsY2tyYnpJZW9qRDd5N0NZdHZPZ01KU1JJRFdTMFkwUzgyd3hyWE5jOVF1S0Q4ZkdLN3VBNjVWelZyRGIvZGQ3TTU1TmdUZ3VlV3NtTSt3RXM1RkFJd1pTa0RWUzRwSEFWUXZESk5SajVOSEsrTmsxMVlnUkRFZ1FaamhTVTRsb2o1MWp0K0pQU21JTXlJRXBOck53b2MrV0NNbEJNZ0Q1M3ZSSzVudkxPcFJua1BGSjR1WU5ibE9xYnZMYVlaWUpiYVgxTGdFQUxPTFl5M2NncE9FbmFmbWQ3YURmTXNMMGwvVytsZmUraTZHM2g3dnlkNVZ0dmg3S2phYng2Z0RlbHNJdFRXYk5YalZYS09takoraXNTVTYwVzlCYUFBOHJZV040aFhWNndBTlB6YXFHRlQyZ2RNNnpLaXBtd1BheGMydXhmQXhhR21GdGlCS2ZJWXRuWklpZk0veUl1MHhwc045K2NMbHR0dE9IQVZtTkVRWkpGNnBKZHVESllkN1dwaVNSaE9xc3NrYzdCNGttUHp0c0I4WHU0VHdwK0dJTERhNHM4V1BVMXBpdlNEeklzM21QKzNCUmhvYVhlTTB5YzZaK3ltS3pOTWladmozNElqRTk5U1NKangzR2t5aDZqUzVxdmg2QzJ3eUFPUnJ0cVJjaEViVC9LZ1U1dUo5cy0tWnZTaXY3NjRWK3NJa2Y5YW9LWkxMUT09--27f65cf8bb44684c454027febce7516ec9f4a5ba",
			pragma: "no-cache",
			"sec-fetch-dest": "empty",
			referer: `https://unsplash.com/@${user}`,
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent":
				"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
		},
	};

	try {
		const response = await axios(config);

		const data = response.data;

		const profile = {
			id: data.id,
			first_name: data.first_name,
			last_name: data.last_name,
			username: data.username,
			bio: data.bio,
			location: data.location,
			links: data.links.html,
			profile_image: data.profile_image.large,
			total_collections: data.total_collections,
			total_likes: data.total_likes,
			total_photos: data.total_photos,
			followers_count: data.followers_count,
			following_count: data.following_count,
			downloads: data.downloads,
		};

		res.status(200).json(profile);
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			// Is this the correct way?
			if (err.response?.status) {
				res.status(err.response?.status).json(err.response.data);
			}
		} else {
			res.status(500);
		}
	}
};

export default profile;
