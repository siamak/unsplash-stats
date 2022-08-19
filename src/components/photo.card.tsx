import React, { memo, useMemo } from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { Item } from "../interface/app.interface";

type Props = {
	item: Item;
	i: number;
};

function numberWithCommas(x: number | string) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const colors = ["#90f1ef", "#ffd6e0", "#ffef9f", "#c1fba4", "#7bf1a8"];

const Photo = ({ item, i }: Props) => {
	const featured = useMemo(() => {
		const topcis = item.topic_submissions;
		return Object.entries(topcis)
			.filter((e) => e[1].status === "approved")
			.map((p) => p[0].split("-").map(capitalize).join(" "));
	}, [item]);

	return (
		<div key={item.id} className="photo">
			{/* <img src={item.urls.regular} alt={item.alt_description} /> */}
			<div className="image">
				<Image
					src={item.urls.regular}
					alt={item.alt_description}
					width={item.width}
					height={item.height}
					layout="fill"
					objectFit="cover"
				/>
			</div>
			<h3 className="heading">
				<a href={item.links.html} target="_blank" rel="noreferrer">
					{i + 1}. {item.description || "UNTITLED"}
				</a>
			</h3>

			{featured.length > 0 && (
				<div className="featured">
					<span className="span">Featured in</span>
					{featured.map((feature) => (
						<span
							style={{
								background: colors[Math.floor(Math.random() * colors.length)],
							}}
							className="span badge"
							key={feature}
						>
							{feature}
						</span>
					))}
				</div>
			)}
			<ul className="meta">
				<li>
					<b>{numberWithCommas(item.statistics.views.total)}</b>
					<span className="label">Views</span>
				</li>
				<li>
					<b>{numberWithCommas(item.statistics.downloads.total)}</b>
					<span className="label">Downloads</span>
				</li>
				<li>
					<b>{numberWithCommas(item.likes)}</b>
					<span className="label">Likes</span>
				</li>
			</ul>

			<Charts item={item} />
			<p className="hint">
				Created At: <b>{new Date(item.created_at).toDateString()}</b>
			</p>
			<style jsx>{`
				.heading {
					font-size: 1rem;
					line-height: 1.25;
					margin: 0;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.featured {
					display: flex;
					align-items: center;
					margin: 0.75rem 0;
					padding: 0;
					flex-wrap: wrap;
					font-size: 0.85rem;
				}

				.featured .span {
					padding: 0.25rem;
					padding-left: 0;
					opacity: 0.5;
				}

				.featured .badge {
					padding: 0.25rem 0.5rem;
					background: #66e297;
					border-radius: 30px;
					opacity: 1;
					color: #19191c;

					margin: 0 0.15rem;
				}

				@media (prefers-color-scheme: dark) {
					.featured .badge {
						background: #195d41;
					}
				}

				.meta {
					display: flex;
					align-items: center;
					list-style: none;
					margin: 1rem 0 0.75rem;
					padding: 0;
					flex-wrap: wrap;
				}

				.meta li {
					flex: 1 1 33.3%;
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.meta .label {
					display: block;
					opacity: 0.5;
					margin: 0.25em 0;
					font-size: 0.75rem;
				}

				.hint {
					font-size: 0.75rem;
					opacity: 0.75;
				}

				.image {
					height: 300px;
					width: 100%;
					position: relative;
					margin: 0 auto 0.5rem;
					background: rgba(0, 0, 0, 0.1);
					overflow: hidden;
					border-radius: 0.25rem;
				}

				.image img {
					display: block;
					border-radius: 0.25rem;
				}

				@media (prefers-color-scheme: dark) {
					.image {
						background: rgba(255, 255, 255, 0.1);
					}
				}

				h6 {
					margin-bottom: 0rem;
				}
				ul {
					font-size: 15px;
					margin-top: 0.5rem;
				}
			`}</style>
		</div>
	);
};

type TooltipProps = {
	active?: boolean;
	payload?: {
		chartType: undefined;
		color: string;
		dataKey: string;
		fill: string;
		formatter: undefined;
		name: string;
		payload: { date: string; value: number };
		points: string[];
		stroke: string;
		strokeWidth: number;
		type: undefined;
		unit: undefined;
		value: number;
	}[];
};

const CTooltip = ({ active, payload }: TooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="tooltip">
				<p className="num">{numberWithCommas(payload[0].value)}</p>
				<p className="hint">{payload[0].payload.date}</p>
			</div>
		);
	}

	return null;
};

function Charts({ item }: { item: Item }) {
	return (
		<>
			<b>Views</b>
			<div className="chart-holder">
				<div className="chart">
					<ResponsiveContainer width={"100%"} height={"100%"}>
						<LineChart
							data={item.statistics.views.historical.values}
							margin={{
								top: 8,
								right: 16,
								left: 16,
								bottom: 8,
							}}
						>
							<Tooltip content={<CTooltip />} />
							<Line type="monotone" dataKey="value" stroke="#7E70FF" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			<b>Downloads</b>
			<div className="chart-holder">
				<div className="chart">
					<ResponsiveContainer width={"100%"} height={"100%"}>
						<LineChart
							data={item.statistics.downloads.historical.values}
							margin={{
								top: 8,
								right: 16,
								left: 16,
								bottom: 8,
							}}
						>
							<Tooltip content={<CTooltip />} />
							<Line type="monotone" dataKey="value" stroke="#44CF6C" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			<style jsx>{`
				.chart {
					font-size: 12px;
					width: 100%;
					height: 100%;
				}

				.chart-holder {
					width: 100%;
					height: 60px;
				}

				b {
					display: block;
					font-size: 0.75rem;
					margin: 0.5rem 0;
				}
			`}</style>
		</>
	);
}

export default memo(Photo);
