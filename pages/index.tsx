import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { VirtuosoGrid } from "react-virtuoso";
import { Item } from "../src/interface/app.interface";
import { useStore } from "laco-react";
import UserStore, { SettingStore, setUser } from "../src/store/store";
import styles from "../styles/photos.module.scss";
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

	return (
		<Layout username={username}>
			{(data?.[0].errors && (
				<pre>{JSON.stringify(data[0].errors, null, 4)}</pre>
			)) || (
				<VirtuosoGrid
					useWindowScroll
					data={photos}
					endReached={() => setSize((prev) => prev + 1)}
					overscan={200}
					itemContent={(i, photo: Item) => (
						<Photo i={i} item={photo} key={photo.id} />
					)}
					listClassName="photos-grid"
					components={{
						Footer: () => (
							<div className={styles.pagination}>
								<p>
									showing {size} page(s) of{" "}
									{isLoadingMore ? "..." : photos.length} photo(s)
								</p>
								<button
									disabled={isLoadingMore || isReachingEnd}
									onClick={() => setSize(size + 1)}
									className={styles.btn}
								>
									{isLoadingMore
										? "Loading..."
										: isReachingEnd
										? "No More Photos"
										: "Load More"}
								</button>

								{isEmpty ? <p>Yay, no photos found.</p> : null}
							</div>
						),
					}}
				/>
			)}
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
