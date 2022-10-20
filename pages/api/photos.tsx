import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Item } from "../../src/interface/app.interface";

type TopicSubmissions = {
	[key: string]: { status: string; approved_on: Date };
};

const topGainers = async (user: string, sort: string) => {
	function getPhotos(page = 1, data: any = []): any {
		console.log(page);
		return axios
			.get(
				`https://unsplash.com/napi/users/${user}/photos?per_page=50&order_by=${sort}&page=${page}&stats=true&xp=unsplash-plus-2%3AControl`
			)
			.then((response: any) => {
				console.log({ page });
				if (response.data.length < 1) return data;
				data.push(...response.data);

				return getPhotos(page + 1, data);
			});
	}
	try {
		const data = await getPhotos(1, []);
		const isDownloads = sort === "downloads";

		if (isDownloads) {
			const lightweightData = data
				.map((d: any) => {
					const values = d.statistics.downloads.historical.values;
					const twoItems = values.slice(-2);
					const percentages = twoItems[1].value - twoItems[0].value;

					const topicAsArray = Object.entries(
						d.topic_submissions as TopicSubmissions
					).map((e) => ({
						topic: e[0].replace("-", " "),
						...e[1],
					}));

					return {
						id: d.id,
						created_at: d.created_at,
						promoted_at: d.promoted_at,

						title: d.description,
						alt_desc: d.alt_description,
						topics: topicAsArray,
						link: d.links.html,
						image: {
							width: d.width,
							height: d.height,
							regular: d.urls.regular,
						},

						likes: d.likes,
						statistics: {
							views: d.statistics.views,
							downloads: d.statistics.downloads,
						},
						gains: Number(percentages),
					};
				})
				.sort((a: any, b: any) => (a.gains > b.gains ? -1 : 1));

			return lightweightData;
		} else {
			const lightweightData = data
				.map((d: any) => {
					const values = d.statistics.views.historical.values;
					const twoItems = values.slice(-2);
					const percentages =
						(twoItems[1].value - twoItems[0].value) / twoItems[0].value;

					const topicAsArray = Object.entries(
						d.topic_submissions as TopicSubmissions
					).map((e) => ({
						topic: e[0].replace("-", " "),
						...e[1],
					}));

					return {
						id: d.id,
						created_at: d.created_at,
						promoted_at: d.promoted_at,

						title: d.description,
						alt_desc: d.alt_description,
						topics: topicAsArray,
						link: d.links.html,
						image: {
							width: d.width,
							height: d.height,
							regular: d.urls.regular,
						},

						likes: d.likes,
						statistics: {
							views: d.statistics.views,
							downloads: d.statistics.downloads,
						},
						gains: Number((percentages * 100).toFixed(2)),
					};
				})
				.sort((a: any, b: any) => (a.gains > b.gains ? -1 : 1));

			return lightweightData;
		}
	} catch (error) {
		return {
			items: [],
		};
	}
};

const photos = async (req: NextApiRequest, res: NextApiResponse<Item[]>) => {
	const { username, p, per_page, type, order_by } = req.query;
	const user = (username as string) || "onlysiamak";
	const topic = (type as string) || "overall";
	const sort = (order_by as string) || "views";
	if (topic === "top_gainers") {
		const data = await topGainers(user, sort);
		res.status(200).json(data as any);
	} else {
		const page = p || 1;
		const perPage = per_page || 12;

		try {
			const response = await axios.get(
				`https://unsplash.com/napi/users/${user}/photos?per_page=${perPage}&order_by=${sort}&page=${page}&stats=true&xp=unsplash-plus-2%3AControl`
			);

			const data = response.data;
			const lightweightData = data.map((d: any) => {
				const values = d.statistics.views.historical.values;
				const twoItems = values.slice(-2);
				const percentages =
					(twoItems[1].value - twoItems[0].value) / twoItems[0].value;

				const topicAsArray = Object.entries(
					d.topic_submissions as TopicSubmissions
				).map((e) => ({
					topic: e[0].replace("-", " "),
					...e[1],
				}));

				return {
					id: d.id,
					created_at: d.created_at,
					promoted_at: d.promoted_at,
					title: d.description,
					alt_desc: d.alt_description,
					topics: topicAsArray,
					link: d.links.html,
					image: {
						width: d.width,
						height: d.height,
						regular: d.urls.regular,
					},

					likes: d.likes,
					statistics: {
						views: d.statistics.views,
						downloads: d.statistics.downloads,
					},
					gains: Number((percentages * 100).toFixed(2)),
				};
			});

			res.status(200).json(lightweightData);
		} catch (error: any) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				res.status(error.response.status).json(error.response.data);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
				res.status(500).json(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error", error.message);
				res.status(500).json(error.message);
			}
			console.log(error.config);
		}
	}
};

export default photos;
