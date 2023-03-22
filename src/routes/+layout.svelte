<script lang='ts'>
    import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Styles } from 'sveltestrap';
    import ForkMeBanner from '../components/ForkMeBanner.svelte';
    let isOpen = false;
    function handleUpdate(event) {
        isOpen = event.detail.isOpen
    }
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