/* eslint-disable @next/next/no-img-element */
import React from "react";
import Head from "next/head";
import axios from "axios";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { Item } from "../src/interface/app.interface";

const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { items: Item[]; user: string };

export default function Unsplash({ items, user }: Props) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>@{user} – Unsplash statistics</title>
			</Head>

			<div className="wrapper">
				<div className="grid">
					{items.map((item, i) => (
						<Photo i={i} item={item} key={item.id} />
					))}
				</div>

				<div className="copyright">
					<span className="hr" />
					<div>
						Created by <a href="https://siamak.me">Siamak</a>.
					</div>
				</div>
			</div>
			<style jsx>{`
				.wrapper {
					width: 100%;

					padding: 4rem;
					margin-right: auto;
					margin-left: auto;
				}
				@media (max-width: 768px) {
					.wrapper {
						padding: 2rem 1rem;
					}
				}
				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
					flex-wrap: wrap;
					grid-gap: 2rem;
					grid-row-gap: 2rem;
					justify-content: center;
					align-items: start;
				}

				.copyright {
					display: flex;
					justify-content: center;
					margin: 10vh 0 2vh;
					flex-direction: column;
					align-items: center;
				}

				.copyright a {
					color: #9677ff;
				}

				.hr {
					display: inline-flex;
					width: 4rem;
					height: 2px;
					margin-bottom: 1rem;
					background: rgba(255, 255, 255, 0.1);
				}

				@media (prefers-color-scheme: light) {
					.hr {
						background: rgba(0, 0, 0, 0.1);
					}
					.copyright a {
						color: #4114db;
					}
				}
			`}</style>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { username } = query;
	const user = username || "onlysiamak";
	function getPhotos(page = 1, data: any = []): any {
		return axios
			.get(
				`https://unsplash.com/napi/users/${user}/photos?per_page=50&order_by=views&page=${page}&stats=true&xp=unsplash-plus-2%3AControl`
			)
			.then((response: any) => {
				console.log({ page });
				if (response.data.length < 1) return data;
				data.push(...response.data);
				return getPhotos(page + 1, data);
			});
	}

	try {
		const data = await getPhotos(1, []);

		return {
			props: { items: data, user },
		};
	} catch (error) {
		return {
			props: { items: [], user },
			notFound: true,
		};
	}
};
