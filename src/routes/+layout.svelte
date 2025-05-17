<script lang='ts'>
	import { navigating } from '$app/stores';
    import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Progress, Styles } from '@sveltestrap/sveltestrap';
    import ForkMeBanner from '../components/ForkMeBanner.svelte';

</script>

<Progress striped={$navigating} animated={$navigating} value={100} style="border-radius: 0" />

<Styles />

<Container>
    <Navbar>
        <NavbarBrand><b>cf-torrent</b></NavbarBrand>
        <Nav style="z-index: 2">
            <NavItem><NavLink href="/search/web">Search Web</NavLink></NavItem>
            <NavItem><NavLink href="/search/torrent">Search Torrents</NavLink></NavItem>
            <NavItem><NavLink href="/api/stremio/manifest.json" target='_blank'>Stremio</NavLink></NavItem>
        </Nav>
    </Navbar>

    <ForkMeBanner url="https://github.com/lucasew/cf-torrent"/>
    <Container>
        <slot/>
    </Container>
</Container>
