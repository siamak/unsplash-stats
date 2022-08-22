import React from "react";
import dynamic from "next/dynamic";
import useSWRInfinite from "swr/infinite";
import { Item } from "../src/interface/app.interface";
import { GetServerSideProps } from "next";
import { useStore } from "laco-react";
import UserStore from "../src/store/store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 12;

const Layout = dynamic(() => import("../src/components/root.layout"), {
	ssr: true,
});
const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { user: string };

export default function Popular({ user }: Props) {
	const state = useStore(UserStore);

	const { data } = useSWRInfinite(
		(index) =>
			`/api/photos?username=${state.username}&p=${
				index + 1
			}&per_page=${PAGE_SIZE}&type=top_gainers`,
		fetcher
	);

	const photos = data ? [].concat(...data) : [];

	return (
		<Layout user={user}>
			<div className="grid">
				{photos.map((photo: Item, i) => (
					<Photo i={i} item={photo} key={photo.id} />
				))}
			</div>

			<style jsx>{`
				.btn {
					background-color: #141414;
					border: 1px solid rgba(54, 54, 54, 0.6);
					opacity: 1;
					font-weight: 500;
					position: relative;
					outline: none;
					border-radius: 50px;
					padding: 1rem;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					margin-top: 0.5rem;
				}

				.form {
					display: flex;
					margin-top: 0.25rem;
					border-radius: 0.375rem;
					margin-bottom: 1rem;
				}

				.form-input {
					border: 0;
					background: #edf2f4;
					color: #19191c;
					padding: 0.5rem;
					border-top-left-radius: 0.375rem;
					border-bottom-left-radius: 0.375rem;
				}

				.form-button {
					border: 0;
					background: #edf2f4;
					color: #19191c;
					padding: 0.5rem;
					cursor: pointer;
					margin-left: 1px;
					border-top-right-radius: 0.375rem;
					border-bottom-right-radius: 0.375rem;
				}

				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
					flex-wrap: wrap;
					grid-gap: 2rem;
					grid-row-gap: 2rem;
					justify-content: center;
					align-items: start;
					min-height: 100vh;
				}

				.pagination {
					display: flex;
					justify-content: center;
					margin: 5rem 0 2rem;
					flex-direction: column;
					align-items: center;
				}
			`}</style>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { username } = query;
	const user = username || "onlysiamak";
	return {
		props: {
			user,
		},
	};
};
