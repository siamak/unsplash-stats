import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import type { SWRConfiguration } from "swr";
import { PAGE_SIZE } from "../config/config";
import { fetcher } from "../utils/utils";

export default function usePhotos(
	key: (index: number) => string,
	options: SWRConfiguration
) {
	const { data, error, size, setSize, isValidating } = useSWRInfinite(
		key,
		fetcher,
		options
	);

	const photos = useMemo(() => (data ? [].concat(...data) : []), [data]);
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === "undefined");
	const isEmpty = data?.[0]?.length === 0;
	const isReachingEnd =
		isEmpty ||
		data?.[0].errors ||
		(data && data[data.length - 1]?.length < PAGE_SIZE);
	const isRefreshing = isValidating && data && data.length === size;

	return {
		data,
		photos,
		error,
		isValidating,
		isReachingEnd,
		isFetchingMore: !!isLoadingMore,
		isRefreshing,
		isEmpty,
		isLoadingInitialData,
		isLoadingMore,
		size,
		setSize,
	};
}
