<script>
	import { Breadcrumb, BreadcrumbItem } from "@sveltestrap/sveltestrap";

</script>
<Breadcrumb>
    <BreadcrumbItem active>Home</BreadcrumbItem>
</Breadcrumb>

<h1>Welcome!</h1>

<p>This is a simple Cloudflare Worker/Webapp to help people cut the bullshit when searching for torrents.</p>
<p>There are a lot of scammy sites that promise to give the gold but just directs users through a maze of link protectors and things like that. This app works by inspecting if the gold is already provided by the site. If not just skips and checks the next one.</p>
<p>It already skips common sites that appear in the searches but are not relevant to the objective.</p>
<p>What you get is mostly pure gold.</p>
<p>It may not show much results or may not find that much results because of <a target="_blank" href="https://developers.cloudflare.com/workers/platform/limits/">cloudflare workers subrequest limitations</a>.</p>