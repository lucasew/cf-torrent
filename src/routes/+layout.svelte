<script lang='ts'>
    import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Styles } from 'sveltestrap';
    import ForkMeBanner from '../components/ForkMeBanner.svelte';
</script>

<Styles />

<Container>
    <Navbar>
        <NavbarBrand><b>cf-torrent</b></NavbarBrand>
        <Nav>
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