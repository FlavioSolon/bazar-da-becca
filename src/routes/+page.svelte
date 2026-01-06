<script>
	import { fade, fly } from 'svelte/transition';
	import tangerineFlower from '$lib/assets/tangerine.png';
	import woodTexture from '$lib/assets/wood-texture.png';
	import { onMount } from 'svelte';

	// Expanded Mock Data - Christian & Classics Focus
	const books = [
		{
			id: 1,
			title: 'O Hobbit',
			author: 'J.R.R. Tolkien',
			price: 'R$ 45,00',
			category: 'Fantasia',
			image: 'https://covers.openlibrary.org/b/id/10667380-L.jpg',
			color: 'bg-green-800'
		},
		{
			id: 2,
			title: 'As Crônicas de Nárnia',
			author: 'C.S. Lewis',
			price: 'R$ 80,00',
			category: 'Fantasia',
			image: 'https://covers.openlibrary.org/b/id/8381861-L.jpg',
			color: 'bg-yellow-700'
		},
		{
			id: 3,
			title: 'Cristianismo Puro e Simples',
			author: 'C.S. Lewis',
			price: 'R$ 35,00',
			category: 'Teologia',
			image: 'https://covers.openlibrary.org/b/id/12563383-L.jpg',
			color: 'bg-blue-900'
		},
		{
			id: 4,
			title: 'O Senhor dos Anéis: A Sociedade do Anel',
			author: 'J.R.R. Tolkien',
			price: 'R$ 55,00',
			category: 'Fantasia',
			image: 'https://covers.openlibrary.org/b/id/10580436-L.jpg',
			color: 'bg-orange-900'
		},
		{
			id: 5,
			title: 'Cartas de um Diabo a seu Aprendiz',
			author: 'C.S. Lewis',
			price: 'R$ 30,00',
			category: 'Ficção Religiosa',
			image: 'https://covers.openlibrary.org/b/id/10602766-L.jpg',
			color: 'bg-red-900'
		},
		{
			id: 6,
			title: 'Ortodoxia',
			author: 'G.K. Chesterton',
			price: 'R$ 40,00',
			category: 'Teologia',
			image: 'https://covers.openlibrary.org/b/id/12626577-L.jpg',
			color: 'bg-amber-800'
		},
		{
			id: 7,
			title: 'O Silmarillion',
			author: 'J.R.R. Tolkien',
			price: 'R$ 60,00',
			category: 'Fantasia',
			image: 'https://covers.openlibrary.org/b/id/10522137-L.jpg',
			color: 'bg-indigo-900'
		},
		{
			id: 8,
			title: 'Os Quatro Amores',
			author: 'C.S. Lewis',
			price: 'R$ 35,00',
			category: 'Teologia',
			image: 'https://covers.openlibrary.org/b/id/14545263-L.jpg',
			color: 'bg-teal-800'
		},
		{
			id: 9,
			title: 'O Homem Eterno',
			author: 'G.K. Chesterton',
			price: 'R$ 45,00',
			category: 'História / Teologia',
			image: 'https://covers.openlibrary.org/b/id/8267077-L.jpg',
			color: 'bg-stone-700'
		},
		{
			id: 10,
			title: 'O Grande Divórcio',
			author: 'C.S. Lewis',
			price: 'R$ 30,00',
			category: 'Ficção Religiosa',
			image: 'https://covers.openlibrary.org/b/id/12470197-L.jpg',
			color: 'bg-slate-700'
		},
		{
			id: 11,
			title: 'Árvore e Folha',
			author: 'J.R.R. Tolkien',
			price: 'R$ 35,00',
			category: 'Fantasia',
			image: 'https://covers.openlibrary.org/b/id/8301149-L.jpg',
			color: 'bg-emerald-900'
		},
		{
			id: 12,
			title: 'A Abolição do Homem',
			author: 'C.S. Lewis',
			price: 'R$ 25,00',
			category: 'Filosofia',
			image: 'https://covers.openlibrary.org/b/id/12457876-L.jpg',
			color: 'bg-cyan-900'
		}
	];

	let hasEntered = false;
	let doorOpen = false;

	// Pagination State
	let currentPage = 1;
	const itemsPerPage = 6;

	$: totalPages = Math.ceil(books.length / itemsPerPage);
	$: paginatedBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	function goToPage(p) {
		if (p >= 1 && p <= totalPages) {
			currentPage = p;
			document.getElementById('bookshelf')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		setTimeout(() => {
			hasEntered = true;
			doorOpen = true;
		}, 500);
	});

	const shelfStyle = `background-image: url('${woodTexture}'); box-shadow: inset 0 2px 5px rgba(0,0,0,0.4);`;
	const whatsappNumber = '5592981496477';
</script>

<div
	class="bg-aged-paper relative min-h-screen overflow-x-hidden selection:bg-[var(--color-moss-green)] selection:text-[var(--color-paper-aged)]"
>
	<!-- Entrance Animation -->
	{#if !doorOpen}
		<div
			class="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[#1a0f0a] transition-opacity duration-1000"
			out:fade={{ duration: 1500 }}
		>
			<div class="text-center">
				<h1 class="font-display mb-4 text-4xl tracking-widest text-[#d4b483] uppercase">
					Bazar da Becca
				</h1>
				<p class="animate-pulse text-[#8b5a2b]">Entrando na biblioteca...</p>
			</div>
		</div>
	{/if}

	<!-- Decorative Flowers (Moved to z-0 to avoid overlapping content) -->
	<div
		class="animate-sway pointer-events-none fixed top-[-50px] left-[-50px] z-0 h-64 w-64 opacity-60 md:h-80 md:w-80 md:opacity-90"
	>
		<img src={tangerineFlower} alt="" class="h-full w-full object-contain drop-shadow-xl filter" />
	</div>
	<div
		class="animate-sway-delayed pointer-events-none fixed right-[-50px] bottom-[-50px] z-0 h-64 w-64 opacity-50 md:h-96 md:w-96 md:opacity-80"
	>
		<img
			src={tangerineFlower}
			alt=""
			class="h-full w-full rotate-180 transform object-contain drop-shadow-xl filter"
		/>
	</div>

	<!-- Main Content -->
	<div
		class="relative z-10 transform pt-16 pb-20 transition-all duration-1000 md:pt-24 {doorOpen
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
	>
		<header class="relative mb-16 px-4 text-center">
			<h1
				class="font-display mb-4 text-5xl text-[var(--color-deep-forest)] drop-shadow-sm md:text-8xl"
			>
				Bazar da Becca
			</h1>
			<div class="mx-auto mb-6 h-1 w-16 rounded-full bg-[var(--color-camo-brown)] md:w-24"></div>
			<p
				class="font-display mx-auto max-w-3xl text-xl leading-relaxed text-[var(--color-camo-brown)] italic md:text-3xl"
			>
				"Uma história para cada alma, um propósito para cada livro."
			</p>
		</header>

		<!-- Bookshelf Container -->
		<div id="bookshelf" class="container mx-auto max-w-6xl px-4">
			<div class="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20 lg:grid-cols-3">
				{#each paginatedBooks as book, i (book.id)}
					<div class="group perspective-1000 relative flex flex-col items-center">
						<!-- Book + Shelf Wrapper -->
						<div class="relative w-full max-w-[280px] md:max-w-full">
							<!-- Clickable Book Area -->
							<div
								class="relative z-20 aspect-[2/3] w-full origin-bottom transform cursor-pointer
                                        overflow-hidden rounded-r bg-[#eaddcf] shadow-2xl
                                        transition-all duration-500 md:rounded-r-lg md:group-hover:z-50 md:group-hover:translate-y-[-15px] md:group-hover:scale-105 md:group-hover:rotate-x-12"
							>
								<img src={book.image} alt={book.title} class="h-full w-full object-cover" />

								<!-- Spine & Lighting -->
								<div
									class="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent md:w-3"
								></div>
								<div
									class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
								></div>
							</div>

							<!-- Individual Shelf (Visible on Mobile & Desktop) -->
							<div
								class="absolute right-[-15px] bottom-[-15px] left-[-15px] z-10 h-6 rounded-sm bg-repeat shadow-lg md:h-8"
								style={shelfStyle}
							></div>
							<!-- Shelf Shadow -->
							<div class="absolute right-0 bottom-[-25px] left-0 z-0 h-8 bg-black/20 blur-lg"></div>
						</div>

						<!-- Info: Mobile (Static Below) vs Desktop (Hover Card) -->
						<div
							class="relative z-30 mt-6 w-full max-w-[280px] text-center md:pointer-events-none
                                    md:absolute md:bottom-full md:left-1/2 md:mb-4 md:w-64 md:max-w-full
                                    md:-translate-x-1/2 md:translate-y-4 md:rounded-sm md:border md:border-[var(--color-camo-brown)]/40 md:bg-[var(--color-paper-aged)] md:p-6
                                    md:opacity-0 md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] md:transition-all md:group-hover:translate-y-0 md:group-hover:opacity-100
									before:md:absolute before:md:top-[-8px] before:md:left-1/2 before:md:-ml-2 before:md:border-r-8 before:md:border-b-8 before:md:border-l-8 before:md:border-transparent before:md:border-b-[var(--color-camo-brown)]/40"
						>
							<!-- Bookmark-ish visual header -->
							<div
								class="absolute top-0 right-0 left-0 hidden h-1 bg-[var(--color-camo-brown)] opacity-20 md:block"
							></div>

							<h3
								class="font-display mb-1 text-xl leading-tight font-bold text-[var(--color-deep-forest)] md:text-2xl"
							>
								{book.title}
							</h3>
							<p
								class="mb-3 text-sm tracking-wider text-[var(--color-camo-brown)] uppercase opacity-80 md:font-semibold"
							>
								{book.author}
							</p>

							<div class="flex flex-col gap-3 md:block">
								<p class="text-xl font-bold text-[var(--color-sunset-orange)] md:mb-3 md:text-xl">
									{book.price}
								</p>

								<a
									href="https://wa.me/{whatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20comprar%20o%20livro%20*{book.title}*"
									target="_blank"
									class="pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-moss-green)] px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[var(--color-sunset-orange)] hover:shadow-lg md:w-auto"
								>
									<span>Eu Quero</span>
									<!-- WhatsApp Icon (optional, simplistic) -->
									<svg viewBox="0 0 24 24" class="h-4 w-4 fill-current"
										><path
											d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
										/></svg
									>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if totalPages > 1}
				<div class="mt-20 flex items-center justify-center gap-4">
					<button
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-moss-green)] font-bold text-[var(--color-cream)]
                                    shadow-lg transition-all hover:scale-105 hover:bg-[var(--color-sunset-orange)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[var(--color-moss-green)]"
						on:click={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						&larr;
					</button>

					<span class="font-display text-xl font-bold text-[var(--color-deep-forest)]">
						Página {currentPage} de {totalPages}
					</span>

					<button
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-moss-green)] font-bold text-[var(--color-cream)]
                                    shadow-lg transition-all hover:scale-105 hover:bg-[var(--color-sunset-orange)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[var(--color-moss-green)]"
						on:click={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						&rarr;
					</button>
				</div>
			{/if}
		</div>

		<footer class="mt-20 text-center text-sm text-[var(--color-camo-brown)]/60">
			<p>Bazar da Becca &copy; 2025</p>
		</footer>
	</div>
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-5deg) translateY(0);
		}
		50% {
			transform: rotate(5deg) translateY(-10px);
		}
	}

	@keyframes sway-delayed {
		0%,
		100% {
			transform: rotate(185deg) translateY(0);
		}
		50% {
			transform: rotate(175deg) translateY(-15px);
		}
	}

	.animate-sway {
		animation: sway 8s ease-in-out infinite;
	}

	.animate-sway-delayed {
		animation: sway-delayed 10s ease-in-out infinite;
	}
</style>
