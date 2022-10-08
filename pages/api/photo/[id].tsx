import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const photo = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	const { id } = req.query;

	try {
		const response = await axios.get(`https://unsplash.com/napi/photos/${id}`);
		console.log({ response });

		const data = response.data;

		const photo = {
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

		res.status(200).json(photo);
	} catch (err) {
		console.log(err);
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

export default photo;
