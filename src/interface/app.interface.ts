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

export interface Topcis {
	topic: string;
	status: "unevaluated" | "rejected" | "approved";
	approved_on?: Date;
}

export interface Item {
	id: string;
	created_at: Date;
	title?: any;
	alt_desc: string;
	// featured: Featured;
	topics: Topcis[];
	link: string;
	image: Image;
	likes: number;
	statistics: Statistics;
	gains: number;
}
