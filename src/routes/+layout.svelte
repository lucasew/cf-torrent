<script lang='typescript' type='module'>
    import { Container, Nav, NavbarBrand, NavItem, NavLink } from 'sveltestrap';
	import ForkMeBanner from '../components/ForkMeBanner.svelte';
</script>

<Container>
    <Nav>
        <NavbarBrand><b>cf-torrent</b></NavbarBrand>
        <NavItem><NavLink href="/search/web">Search Web</NavLink></NavItem>
        <NavItem><NavLink href="/search/torrent">Search Torrents</NavLink></NavItem>
    </Nav>

    <ForkMeBanner url="https://github.com/lucasew/cf-torrent"/>
    <Container>
        <slot/>
    </Container>
</Container>