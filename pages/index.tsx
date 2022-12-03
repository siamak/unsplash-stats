import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Item } from "../src/interface/app.interface";
import { useStore } from "laco-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import UserStore, { SettingStore, setUser } from "../src/store/store";
import { PAGE_SIZE } from "../src/config/config";
import usePhotos from "../src/hooks/usePhotos.swr";

const Layout = dynamic(() => import("../src/components/root.layout"), {
	ssr: true,
});

const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { username: string };

export default function Unsplash({ username }: Props) {
	const state = useStore(UserStore);
	const setting = useStore(SettingStore);
	const { sortBy } = setting;

	useEffect(() => {
		setUser(username);
	}, [username]);

	const {
		data,
		photos,
		error,
		isValidating,
		isReachingEnd,
		isFetchingMore,
		isRefreshing,
		isEmpty,
		isLoadingInitialData,
		isLoadingMore,
		size,
		setSize,
	} = usePhotos(
		(index) =>
			`/api/photos?username=${state.username}&p=${
				index + 1
			}&per_page=${PAGE_SIZE}&order_by=${sortBy}`,
		{
			revalidateOnFocus: false,
		}
	);

	const [gridRef] = useInfiniteScroll({
		loading: isValidating,
		hasNextPage: !isReachingEnd,
		onLoadMore: () => setSize((prev) => prev + 1),
		// When there is an error, we stop infinite loading.
		// It can be reactivated by setting "error" state as undefined.
		disabled: !!error,
		// `rootMargin` is passed to `IntersectionObserver`.
		// We can use it to trigger 'onLoadMore' when the sentry comes near to become
		// visible, instead of becoming fully visible on the screen.
		rootMargin: "0px 0px 100px 0px",
	});

	return (
		<Layout username={username}>
			{(data?.[0].errors && (
				<pre>{JSON.stringify(data[0].errors, null, 4)}</pre>
			)) || (
				<div className="photos-grid" ref={gridRef}>
					{photos.map((photo: Item, i) => (
						<Photo i={i} item={photo} key={photo.id} />
					))}
				</div>
			)}

			<div className="pagination" ref={gridRef}>
				<p>
					showing {size} page(s) of {isLoadingMore ? "..." : photos.length}{" "}
					photo(s)
				</p>
				<button
					disabled={isLoadingMore || isReachingEnd}
					onClick={() => setSize(size + 1)}
					className="btn"
				>
					{isLoadingMore
						? "Loading..."
						: isReachingEnd
						? "No More Photos"
						: "Load More"}
				</button>

				{isEmpty ? <p>Yay, no photos found.</p> : null}
			</div>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { username } = query;
	const user = username || "onlysiamak";
	return {
		props: {
			username: user,
		},
	};
};
