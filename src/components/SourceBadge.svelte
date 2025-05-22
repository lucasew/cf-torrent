<script lang="ts">
  import { Badge } from '@sveltestrap/sveltestrap'
  // source name, e.g., 'Google', 'DuckDuckGo', 'Yandex'
  export let source: string
  // map source to badge color
  const colors: Record<string, string> = {
    Google: 'primary',
    DuckDuckGo: 'info',
    Yandex: 'warning'
  }
  const color = colors[source] ?? 'secondary'
</script>
<Badge color={color} class="me-1">{source}</Badge>