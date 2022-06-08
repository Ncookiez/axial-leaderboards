<script lang="ts">

	// Imports:
	import { onMount } from 'svelte';
	import { fetchSAXIALBalances, fetchVeAXIALBalances } from '$lib/queries';

	// Type Imports:
	import type { Address } from 'weaverfi/dist/types';

	// Initializations:
	const leaderboardSize = 10;
	const refreshTimeInSeconds = 10;
	let sAXIALBalances: { wallet: Address, balance: number }[] = [];
	let veAXIALBalances: { wallet: Address, accrued: number, staked: number }[] = [];

	// Reactive Staked Totals:
	$: sAXIALTotal = sAXIALBalances.reduce((prev, curr) => prev + curr.balance, 0);
	$: veAXIALTotal = veAXIALBalances.reduce((prev, curr) => prev + curr.accrued, 0);

	// Function to format numbers:
	const formatNum = (num: number) => {
		if(num > (10 ** 12)) {
			return (num / (10 ** 12)).toLocaleString(undefined, {maximumFractionDigits: 2}) + 'T';
		} else if(num > (10 ** 9)) {
			return (num / (10 ** 9)).toLocaleString(undefined, {maximumFractionDigits: 2}) + 'B';
		} else if(num > (10 ** 6)) {
			return (num / (10 ** 6)).toLocaleString(undefined, {maximumFractionDigits: 2}) + 'M';
		} else if(num > 100000) {
			return (num / 1000).toLocaleString(undefined, {maximumFractionDigits: 0}) + 'k';
		} else if(num > 10000) {
			return (num / 1000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'k';
		} else if(num > 1000) {
			return (num / 1000).toLocaleString(undefined, {maximumFractionDigits: 2}) + 'k';
		} else if(num > 100) {
			return num.toLocaleString(undefined, {maximumFractionDigits: 0});
		} else if(num < 0.001) {
			return num.toLocaleString(undefined, {maximumFractionDigits: 5});
		} else if(num < 0.01) {
			return num.toLocaleString(undefined, {maximumFractionDigits: 4});
		} else if(num < 0.1) {
			return num.toLocaleString(undefined, {maximumFractionDigits: 3});
		} else {
			return num.toLocaleString(undefined, {maximumFractionDigits: 2});
		}
	}

	onMount(async () => {
		sAXIALBalances = await fetchSAXIALBalances();
		veAXIALBalances = await fetchVeAXIALBalances();
		setInterval(async () => {
			sAXIALBalances = await fetchSAXIALBalances();
			veAXIALBalances = await fetchVeAXIALBalances();
		}, refreshTimeInSeconds * 1000);
	});
	
</script>

<!-- #################################################################################################### -->

<!-- SvelteKit Dynamic Header -->
<svelte:head>
	<title>Axial Leaderboards</title>
	<meta name="description" content="Check the top stakers of sAXIAL and veAXIAL, in real-time!" />
</svelte:head>

<!-- Axial Banner -->
<div class="banner">
	<img src="/images/banner.png" alt="Axial">
	<h1>Leaderboards</h1>
</div>

<!-- Leaderboards -->
<div class="leaderboards">
	
	<!-- sAXIAL Leaderboard -->
	<div class="sAXIAL">
		<h2>sAXIAL</h2>
		{#each sAXIALBalances.slice(0, leaderboardSize) as sAXIALStake, i}
			<span class="entry">
				<span class="ranking">{i + 1}.</span>
				<span class="wallet"><a href="https://snowtrace.io/address/{sAXIALStake.wallet}" target="__blank">{sAXIALStake.wallet.slice(0, 6)}…{sAXIALStake.wallet.slice(sAXIALStake.wallet.length - 4)}</a>:</span>
				<span class="balance">{formatNum(sAXIALStake.balance)} sAXIAL</span>
				<span class="percentage">({((sAXIALStake.balance / sAXIALTotal) * 100).toFixed(2)}%)</span>
			</span>
		{/each}
	</div>
	
	<!-- veAXIAL Leaderboard -->
	<div class="veAXIAL">
		<h2>veAXIAL</h2>
		{#each veAXIALBalances.slice(0, leaderboardSize) as veAXIALStake, i}
			<span class="entry">
				<span class="ranking">{i + 1}.</span>
				<span class="wallet"><a href="https://snowtrace.io/address/{veAXIALStake.wallet}" target="__blank">{veAXIALStake.wallet.slice(0, 6)}…{veAXIALStake.wallet.slice(veAXIALStake.wallet.length - 4)}</a>:</span>
				<span class="balance">{formatNum(veAXIALStake.accrued)} veAXIAL</span>
				<span class="percentage">({((veAXIALStake.accrued / veAXIALTotal) * 100).toFixed(2)}%)</span>
				<span class="staked">+{formatNum(veAXIALStake.staked)}/s</span>
			</span>
		{/each}
	</div>
</div>


<!-- #################################################################################################### -->

<style>

	h1 {
		margin-left: .3em;
		color: var(--accent-color);
		font-size: 7em;
		font-weight: bold;
	}

	h2 {
		margin-bottom: .5em;
		color: var(--accent-color);
		text-align: center;
	}

	a {
		color: var(--font-color);
		font-weight: bold;
		text-decoration: none;
	}

	.banner {
		display: flex;
		align-items: center;
		margin: 2em;
	}

	.banner > img {
		width: 500px;
	}

	.leaderboards {
		display: flex;
		margin: 0 5vw 10vh;
	}

	.sAXIAL, .veAXIAL {
		display: flex;
		flex-direction: column;
		margin: 2em 3em;
		padding: 1em;
		background-color: var(--secondary-color);
		border: 2px solid var(--accent-color);
		border-radius: 1em;
	}
	
	.entry {
		display: flex;
		align-items: center;
		margin: .2em 1em;
		padding: .1em .5em;
		border-radius: .5em;
		white-space: nowrap;
	}

	.entry:hover {
		background-color: rgba(165, 165, 165, 0.2);
	}

	.ranking {
		width: 3ch;
		text-align: center;
	}

	.wallet {
		margin-right: 1em;
		font-family: 'Courier Prime', monospace;
	}

	.veAXIAL .percentage {
		margin-right: 1em;
	}

	.balance {
		margin-right: .5em;
	}

	.staked {
		margin-left: auto;
		color: greenyellow;
	}

	@media screen and (max-width: 1400px) {
		.banner {
			flex-direction: column;
		}
	}

	@media screen and (max-width: 1150px) {
		.leaderboards {
			flex-direction: column;
		}
		.sAXIAL, .veAXIAL {
			margin: 1em 0;
		}
	}

	@media screen and (max-width: 850px) {
		h1 {
			font-size: 5em;
		}
	}

	@media screen and (max-width: 600px) {
		h1 {
			font-size: 3em;
		}
		.banner > img {
			width: 300px;
		}
		.leaderboards {
			font-size: .9em;
		}
	}

	@media screen and (max-width: 475px) {
		.percentage {
			margin-right: 0 !important;
		}
		.staked {
			display: none;
		}
	}

	@media screen and (max-width: 400px) {
		.sAXIAL, .veAXIAL {
			padding: 1em .5em;
		}
		.entry {
			margin: .2em 0;
		}
	}
	
</style>