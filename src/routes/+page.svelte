<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<div class="breadcrumbs text-sm">
	<ul>
		<li>{m.home_header_title()}</li>
	</ul>
</div>

<h1 class="text-4xl font-bold mb-4">{m.home_header_welcome()}</h1>

<div class="prose max-w-none">
	<p>{@html m.home_header_description()}</p>
	<p>{@html m.home_header_scammy_sites_description()}</p>
	<p>{@html m.home_header_skip_sites_description()}</p>
	<p>{@html m.home_header_pure_gold_description()}</p>
	<p>
		{@html m.home_header_cloudflare_limits_description()}
	</p>
</div>
