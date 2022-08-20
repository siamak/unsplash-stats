import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const profile = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { username, p, per_page } = req.query;
	const user = (username as string) || "onlysiamak";

	try {
		const response = await axios.get(
			`https://unsplash.com/napi/users/${user}/?stats=true&xp=unsplash-plus-2%3AControl`
		);

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
