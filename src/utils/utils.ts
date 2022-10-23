export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const debounce = (fn: Function, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};

export const numberWithCommas = (str: number | string) => {
	return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
