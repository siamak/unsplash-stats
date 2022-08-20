import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Item } from "../../src/interface/app.interface";

const photos = async (req: NextApiRequest, res: NextApiResponse<Item[]>) => {
	const { username, p, per_page } = req.query;
	const user = username || "onlysiamak";
	const page = p || 1;
	const perPage = per_page || 12;

	try {
		const response = await axios.get(
			`https://unsplash.com/napi/users/${user}/photos?per_page=${perPage}&order_by=views&page=${page}&stats=true&xp=unsplash-plus-2%3AControl`
		);

		const data = response.data;
		const lightweightData = data.map((d: any) => ({
			id: d.id,
			created_at: d.created_at,
			title: d.description,
			alt_desc: d.alt_description,
			featured: d.topic_submissions,
			link: d.links.html,
			image: {
				regular: d.urls.regular,
				// width: d.width,
				// height: d.height,
			},

			likes: d.likes,
			statistics: {
				views: d.statistics.views,
				downloads: d.statistics.downloads,
			},
		}));

		res.status(200).json(lightweightData);
	} catch (error: any) {
		res.status(500).json(error);
	}
};

export default photos;
