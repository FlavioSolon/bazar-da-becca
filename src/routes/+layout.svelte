<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

{#if !$page.url.pathname.startsWith('/admin')}
	<ShareButton />
{/if}
