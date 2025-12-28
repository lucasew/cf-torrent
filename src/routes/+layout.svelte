<script lang="ts">
	import { navigating } from '$app/stores';
	import ForkMeBanner from '../components/ForkMeBanner.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import '../app.css';
</script>

<!-- Progress bar at top when navigating -->
{#if $navigating}
	<progress
		class="progress progress-primary w-full absolute top-0 left-0"
		style="border-radius: 0; z-index: 9999;"
	></progress>
{/if}

<div class="min-h-screen flex flex-col">
	<div class="container mx-auto px-4 flex-1 flex flex-col">
		<!-- Navbar -->
		<div class="navbar bg-base-100">
			<div class="navbar-start gap-2">
				<a href="/" class="btn btn-ghost text-xl font-bold">cf-torrent</a>
				<ThemeToggle />
				<!-- Mobile menu dropdown -->
				<details class="dropdown lg:hidden">
					<summary class="btn btn-ghost list-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</summary>
					<ul
						class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li><a href="/search/web">Search Web</a></li>
						<li><a href="/search/torrent">Search Torrents</a></li>
						<li><a href="/api/stremio/manifest.json" target="_blank">Stremio</a></li>
					</ul>
				</details>
			</div>
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<li><a href="/search/web">Search Web</a></li>
					<li><a href="/search/torrent">Search Torrents</a></li>
					<li><a href="/api/stremio/manifest.json" target="_blank">Stremio</a></li>
				</ul>
			</div>
			<div class="navbar-end">
				<!-- Empty -->
			</div>
		</div>

		<ForkMeBanner url="https://github.com/lucasew/cf-torrent" />

		<div class="py-4 flex-1">
			<slot />
		</div>
	</div>
</div>
