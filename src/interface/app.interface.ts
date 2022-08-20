// export interface Urls {
// 	raw: string;
// 	full: string;
// 	regular: string;
// 	small: string;
// 	thumb: string;
// 	small_s3: string;
// }

// export interface Links {
// 	self: string;
// 	html: string;
// 	download: string;
// 	download_location: string;
// }

// export interface TopicSubmissions {}

// export interface Links2 {
// 	self: string;
// 	html: string;
// 	photos: string;
// 	likes: string;
// 	portfolio: string;
// 	following: string;
// 	followers: string;
// }

// export interface ProfileImage {
// 	small: string;
// 	medium: string;
// 	large: string;
// }

// export interface Social {
// 	instagram_username: string;
// 	portfolio_url: string;
// 	twitter_username: string;
// 	paypal_email?: any;
// }

// export interface User {
// 	id: string;
// 	updated_at: Date;
// 	username: string;
// 	name: string;
// 	first_name: string;
// 	last_name?: any;
// 	twitter_username: string;
// 	portfolio_url: string;
// 	bio: string;
// 	location?: any;
// 	links: Links2;
// 	profile_image: ProfileImage;
// 	instagram_username: string;
// 	total_collections: number;
// 	total_likes: number;
// 	total_photos: number;
// 	accepted_tos: boolean;
// 	for_hire: boolean;
// 	social: Social;
// }

// export interface Value {
// 	date: string;
// 	value: number;
// }

// export interface Historical {
// 	change: number;
// 	resolution: string;
// 	quantity: number;
// 	values: Value[];
// }

// export interface Downloads {
// 	total: number;
// 	historical: Historical;
// }

// export interface Value2 {
// 	date: string;
// 	value: number;
// }

// export interface Historical2 {
// 	change: number;
// 	resolution: string;
// 	quantity: number;
// 	values: Value2[];
// }

// export interface Views {
// 	total: number;
// 	historical: Historical2;
// }

// export interface Value3 {
// 	date: string;
// 	value: number;
// }

// export interface Historical3 {
// 	change: number;
// 	resolution: string;
// 	quantity: number;
// 	values: Value3[];
// }

// export interface Likes {
// 	total: number;
// 	historical: Historical3;
// }

// export interface Statistics {
// 	downloads: Downloads;
// 	views: Views;
// 	likes: Likes;
// }

// export interface Item {
// 	id: string;
// 	created_at: Date;
// 	updated_at: Date;
// 	promoted_at?: any;
// 	width: number;
// 	height: number;
// 	color: string;
// 	blur_hash: string;
// 	description: string;
// 	alt_description: string;
// 	urls: Urls;
// 	links: Links;
// 	categories: any[];
// 	likes: number;
// 	liked_by_user: boolean;
// 	current_user_collections: any[];
// 	sponsorship?: any;
// 	topic_submissions: TopicSubmissions;
// 	user: User;
// 	statistics: Statistics;
// }

export interface Featured {}

export interface Image {
	regular: string;
	width: number;
	height: number;
}

export interface Value {
	date: string;
	value: number;
}

export interface Historical {
	change: number;
	resolution: string;
	quantity: number;
	values: Value[];
}

export interface Views {
	total: number;
	historical: Historical;
}

export interface Value2 {
	date: string;
	value: number;
}

export interface Historical2 {
	change: number;
	resolution: string;
	quantity: number;
	values: Value2[];
}

export interface Downloads {
	total: number;
	historical: Historical2;
}

export interface Statistics {
	views: Views;
	downloads: Downloads;
}

export interface Item {
	id: string;
	created_at: Date;
	title?: any;
	alt_desc: string;
	featured: Featured;
	link: string;
	image: Image;
	likes: number;
	statistics: Statistics;
}
