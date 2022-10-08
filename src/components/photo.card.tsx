import React, { memo } from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { Item } from "../interface/app.interface";
import { useStore } from "laco-react";
import { SettingStore } from "../store/store";

type Props = {
	item: Item;
	i: number;
};

function numberWithCommas(str: number | string) {
	return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// function capitalize(str: string) {
// 	return str.charAt(0).toUpperCase() + str.slice(1);
// }

const colors = [
	"#efe35c",
	"#f4ae7c",
	"#fa8997",
	"#e477d5",
	"#b495ee",
	"#7dacf2",
	"#53c3f3",
	"#28d8f3",
	"#38e6c9",
	"#4cf065",
];

const Photo = ({ item, i }: Props) => {
	const settingStore = useStore(SettingStore);

	return (
		<div className="photo">
			<div className="image">
				<Image
					src={item.image.regular}
					alt={item.alt_desc}
					layout="fill"
					loading="lazy"
					objectFit="cover"
				/>
			</div>
			<h3 className="heading">
				<a href={item.link} target="_blank" rel="noreferrer">
					{i + 1}. {item.title || item.alt_desc || "UNTITLED"}
				</a>
			</h3>

			{item.topics.filter((e) => e.status === "approved").length > 0 && (
				<div className="featured">
					<span className="span">Featured in</span>
					{item.topics
						.filter((e) => e.status === "approved")
						.map((feature) => (
							<span
								className={`${feature.status} span badge`}
								style={{
									background: colors[Math.floor(Math.random() * colors.length)],
								}}
								key={feature.topic}
								title={
									feature.approved_on &&
									new Date(feature.approved_on).toString()
								}
							>
								{feature.status === "rejected" ? "× " : ""}
								{feature.status === "unevaluated" ? "• " : ""}
								{feature.topic}
							</span>
						))}
				</div>
			)}
			<p className="hint">
				Created At: <b>{new Date(item.created_at).toDateString()}</b>
			</p>
			<ul className="meta">
				<li>
					<b>{numberWithCommas(item.statistics.views.total || 0)}</b>
					<span className="label">Views</span>
				</li>
				<li>
					<b>{numberWithCommas(item.statistics.downloads.total || 0)}</b>
					<span className="label">Downloads</span>
				</li>
				<li>
					<b>{numberWithCommas(item.likes || 0)}</b>
					<span className="label">Likes</span>
				</li>
				<li>
					<b>
						<span className={item.gains > 0 ? "gain-green" : "gain-red"}>
							{numberWithCommas(item.gains || 0)}%
						</span>
					</b>
					<span className="label">%1d</span>
				</li>
			</ul>

			<Charts item={item} />
			{settingStore.showTopics && (
				<>
					{item.topics.filter(
						(e) => e.status === "rejected" || e.status === "unevaluated"
					).length > 0 && (
						<div className="featured">
							<span className="span">Waiting or Rejected</span>
							{item.topics
								.filter(
									(e) => e.status === "rejected" || e.status === "unevaluated"
								)
								.map((feature) => (
									<span className={`${feature.status}`} key={feature.topic}>
										{feature.topic}
									</span>
								))}
						</div>
					)}
				</>
			)}
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

				.gain-red {
					color: #ee3171;
				}
				.gain-green {
					color: #66e297;
				}

				@media (prefers-color-scheme: light) {
					.gain-red {
						color: #db143e;
					}
					.gain-green {
						color: #15ab51;
					}
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

					text-transform: capitalize;
				}

				.featured .unevaluated {
					padding: 0.25rem 0.5rem;
					opacity: 0.4;
				}

				.featured .rejected {
					padding: 0.25rem 0.5rem;
					text-decoration: line-through;
					opacity: 0.6;
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
					flex: 1 1 25%;
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
					height: 400px;
					width: 100%;
					position: relative;
					margin: 0 auto 0.5rem;
					background: rgba(0, 0, 0, 0.1);
					overflow: hidden;
					border-radius: 0.5rem;
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
				<p className="num">{numberWithCommas(payload[0].value || 0)}</p>
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
