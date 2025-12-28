<script lang="ts">
	// source name, e.g., 'Google', 'DuckDuckGo', 'Yandex'
	export let source: string;
	// map source to badge color (DaisyUI classes)
	const colors: Record<string, string> = {
		Google: 'badge-primary',
		DuckDuckGo: 'badge-info',
		Yandex: 'badge-warning'
	};
	const colorClass = colors[source] ?? 'badge-secondary';
</script>

<span class="badge {colorClass} mr-1">{source}</span>
