import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { VirtuosoGrid } from "react-virtuoso";
import { Item } from "../src/interface/app.interface";
import { GetServerSideProps } from "next";
import { useStore } from "laco-react";
import UserStore, { SettingStore, setUser } from "../src/store/store";
import { fetcher } from "../src/utils/utils";
import { PAGE_SIZE } from "../src/config/config";

const Layout = dynamic(() => import("../src/components/root.layout"), {
	ssr: true,
});
const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { username: string };

export default function Popular({ username }: Props) {
	const state = useStore(UserStore);
	const setting = useStore(SettingStore);
	const { sortBy } = setting;

	useEffect(() => {
		setUser(username);
	}, [username]);

	const { data } = useSWR(
		`/api/photos?username=${state.username}&p=1&per_page=${PAGE_SIZE}&type=top_gainers&order_by=${sortBy}`,
		fetcher,
		{
			revalidateOnFocus: false,
		}
	);

	const photos = useMemo(() => (data ? [].concat(...data) : []), [data]);

	return (
		<Layout username={username}>
			{(data?.[0].errors && (
				<pre>{JSON.stringify(data[0].errors, null, 4)}</pre>
			)) || (
				<VirtuosoGrid
					useWindowScroll
					data={photos}
					overscan={200}
					itemContent={(i, photo: Item) => (
						<Photo i={i} item={photo} key={photo.id} />
					)}
					listClassName="photos-grid"
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
