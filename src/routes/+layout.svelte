<script>

	// Imports:
	import Footer from '$lib/Footer.svelte';
	import '../app.css';
	
</script>

<!-- #################################################################################################### -->

<!-- App Content -->
<main><slot /></main>

<!-- Footer -->
<Footer />

<!-- #################################################################################################### -->

<style>

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1 0;
		overflow: hidden auto;
	}

</style>